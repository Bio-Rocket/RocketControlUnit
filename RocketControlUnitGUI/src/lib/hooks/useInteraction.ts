import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
import type { PocketbaseHook } from './usePocketbase';


const stateToCommand: { [key: string]: string } = {
    ABORT: 'GOTO_ABORT',
	TEST: 'GOTO_TEST',
    FILL: 'GOTO_FILL',
    IGNITION: "GOTO_IGNITION",
	FIRE: 'GOTO_FIRE',
	POST_FIRE: 'GOTO_POST_FIRE',
};

const commandToState = Object.fromEntries(
	Object.entries(stateToCommand).map(([key, value]) => [value, key])
);

const expected_valve_states: {[key: string]: {[key: string]: string}} = {
	'GOTO_ABORT': {
		'PBV1': 'PBV1_CLOSE',
		'PBV2': 'PBV2_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV3': 'PBV3_CLOSE',
		'PBV4': 'PBV4_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV5': 'PBV5_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV6': 'PBV6_CLOSE',
		'PBV7': 'PBV7_CLOSE',
		'PBV8': 'PBV8_CLOSE',
		'PBV9': 'PBV9_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV10': 'PBV10_CLOSE',
		'PBV11': 'PBV11_CLOSE',
		'SOL1': 'SOL1_CLOSE',
		'SOL2': 'SOL2_CLOSE',
		'SOL3': 'SOL3_CLOSE',
		'SOL4': 'SOL4_CLOSE',
		'SOL5': 'SOL5_CLOSE',
		'SOL6': 'SOL6_CLOSE',
		'SOL7': 'SOL7_CLOSE',
		'SOL8': 'SOL8_CLOSE',
		'SOL9': 'SOL9_CLOSE',
		'SOL10': 'SOL10_CLOSE',
		'SOL11': 'SOL11_OPEN',
		'SOL12': 'SOL12_OPEN',
		'SOL13': 'SOL13_CLOSE',
		'SOL14': 'SOL14_CLOSE',
	},
	'GOTO_IGNITION': {
		'PBV1': 'PBV1_CLOSE',
		'PBV2': 'PBV2_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV3': 'PBV3_CLOSE',
		'PBV4': 'PBV4_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV5': 'PBV5_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV6': 'PBV6_CLOSE',
		'PBV7': 'PBV7_CLOSE',
		'PBV8': 'PBV8_OPEN',
		'PBV9': 'PBV9_OPEN', //ENERGIZED SO OPEN MEANS CLOSED
		'PBV10': 'PBV10_CLOSE',
		'PBV11': 'PBV11_CLOSE',
		'SOL1': 'SOL1_CLOSE',
		'SOL2': 'SOL2_CLOSE',
		'SOL3': 'SOL3_OPEN',
		'SOL4': 'SOL4_OPEN',
		'SOL5': 'SOL5_OPEN',
		'SOL6': 'SOL6_CLOSE',
		'SOL7': 'SOL7_OPEN',
		'SOL8': 'SOL8_OPEN',
		'SOL9': 'SOL9_CLOSE',
		'SOL10': 'SOL10_OPEN',
		'SOL11': 'SOL11_CLOSE',
		'SOL12': 'SOL12_CLOSE',
		'SOL13': 'SOL13_CLOSE',
		'SOL14': 'SOL14_CLOSE',
	},
	'GOTO_FIRE': {
		'PBV6': 'PBV6_OPEN',
		'PBV7': 'PBV7_OPEN',
		'PBV10': 'PBV10_OPEN',
		'PBV11': 'PBV11_OPEN',
		'SOL13': 'SOL13_OPEN',
		'SOL14': 'SOL14_OPEN',
	},
	'GOTO_POSTFIRE': {
		'PBV6': 'PBV6_CLOSE',
		'PBV7': 'PBV7_CLOSE',
		'PBV10': 'PBV10_CLOSE',
		'PBV11': 'PBV11_CLOSE',
		'SOL13': 'SOL13_CLOSE',
		'SOL14': 'SOL14_CLOSE',
	}
};

Object.freeze(stateToCommand);
Object.freeze(commandToState);
Object.freeze(expected_valve_states);

const validateStateChange = (stateCommand: string, current_valve_states: { [key: string]: string }): string[] => {
    const expected_valves = expected_valve_states[stateCommand];
    if (!expected_valves) {
        console.log(`No expected states defined for command: ${stateCommand}`);
        return [];
    }

    const nonCompliantValves: string[] = [];

    for (const [valve, expectedState] of Object.entries(expected_valves)) {
        const currentStateValve = Number(current_valve_states[valve]);
        const expectedStateValve = expectedState.includes('OPEN') ? 1 : 0;

		if (Number.isNaN(currentStateValve)) {
			console.error(`Valve ${valve} not found in current valve states`);
			continue; // Skip if valve state is not found
		}

        if (currentStateValve !== expectedStateValve) {
            console.log(`Mismatch for ${valve}: expected_state ${expectedState}, current_state ${currentStateValve}`);
            nonCompliantValves.push(valve);
        }
    }

    return nonCompliantValves;
};

export const useInteraction = (pocketbaseHook: PocketbaseHook) => {
	const modalStore = getModalStore();

	let nextStatePending: string = '';

	const confirmStateChange = (state: string, current_valve_states: {[key: string]: string}) => {
		nextStatePending = state;
		const nonCompliantValves = validateStateChange(state, current_valve_states);

		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: `Are you sure you wish to proceed to ${commandToState[state]}?\n
			${nonCompliantValves.length > 0 ? `The following valves are not in the expected state: ${nonCompliantValves.join(', ')}` : ''}`,
			response: (r: boolean) => {
				if (r) {
					pocketbaseHook.writeStateChange(nextStatePending);
				}

				nextStatePending = '';
			}
		};

		modalStore.trigger(modal);
	};

	const instantStateChange = (state: string) => {
		nextStatePending = state;
		pocketbaseHook.writeStateChange(nextStatePending);
		nextStatePending = '';
	};

	const confirmPlcReset = () => {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Confirm PLC Reset',
			body: 'Are you sure you want to send PLC RESET to the Ground System?',
			response: (r: boolean) => {
				if (r) {
					pocketbaseHook.writeGroundSystemsCommand('PLC_RESET');
				}
			}
		};

		modalStore.trigger(modal);
	};



	return {
		confirmStateChange,
		instantStateChange,
		confirmPlcReset,
	};
};