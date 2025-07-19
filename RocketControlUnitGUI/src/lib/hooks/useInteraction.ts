import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
import type { PocketbaseHook } from './usePocketbase';
import { initStores } from '../stores';

const stores = initStores();

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
		'PBV2': 'PBV2_OPEN',
		'PBV3': 'PBV3_CLOSE',
		'PBV4': 'PBV4_OPEN',
		'PBV5': 'PBV5_OPEN',
		'PBV6': 'PBV6_CLOSE',
		'PBV7': 'PBV7_CLOSE',
		'PBV8': 'PBV8_CLOSE',
		'PBV9': 'PBV9_OPEN',
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
		'PBV2': 'PBV2_CLOSE',
		'PBV3': 'PBV3_CLOSE',
		'PBV4': 'PBV4_CLOSE',
		'PBV5': 'PBV5_CLOSE',
		'PBV6': 'PBV6_CLOSE',
		'PBV7': 'PBV7_CLOSE',
		'PBV8': 'PBV8_OPEN',
		'PBV9': 'PBV9_CLOSE',
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

const getValveState = (valve: string): number => {
	if (valve == 'PBV1') {
		return Number(stores.pbv1_open);
	}
	if (valve == 'PBV2') {
		return Number(stores.pbv2_open);
	}
	if (valve == 'PBV3') {
		return Number(stores.pbv3_open);
	}
	if (valve == 'PBV4') {
		return Number(stores.pbv4_open);
	}
	if (valve == 'PBV5') {
		return Number(stores.pbv5_open);
	}
	if (valve == 'PBV6') {
		return Number(stores.pbv6_open);
	}
	if (valve == 'PBV7') {
		return Number(stores.pbv7_open);
	}
	if (valve == 'PBV8') {
		return Number(stores.pbv8_open);
	}
	if (valve == 'PBV9') {
		return Number(stores.pbv9_open);
	}
	if (valve == 'PBV10') {
		return Number(stores.pbv10_open);
	}
	if (valve == 'PBV11') {
		return Number(stores.pbv11_open);
	}
	if (valve == 'SOL1') {
		return Number(stores.sol1_open);
	}
	if (valve == 'SOL2') {
		return Number(stores.sol2_open);
	}
	if (valve == 'SOL3') {
		return Number(stores.sol3_open);
	}
	if (valve == 'SOL4') {
		return Number(stores.sol4_open);
	}
	if (valve == 'SOL5') {
		return Number(stores.sol5_open);
	}
	console.error(`Valve ${valve} not found in store`);
	return -1; // Return an invalid state if valve not found
};

const validateStateChange = (stateCommand: string): string[] => {
	const expected_valves = expected_valve_states[stateCommand];
	if (!expected_valves) {
		console.log(`No expected states defined for command: ${stateCommand}`);
		return [];
	}

	const nonCompliantValves: string[] = [];

	for (const [valve, expectedState] of Object.entries(expected_valves)) {
		const currentStateValve = getValveState(valve);
		const expectedStateValve = expectedState.includes('OPEN') ? 1 : 0;

		if (currentStateValve !== expectedStateValve) {
			console.log(`Mismatch for ${valve}: expected ${expectedState}, got ${currentStateValve}`);
			nonCompliantValves.push(valve);
		}
	}

	return nonCompliantValves;
};

export const useInteraction = (pocketbaseHook: PocketbaseHook) => {
	const modalStore = getModalStore();

	let nextStatePending: string = '';

	const confirmStateChange = (state: string) => {
		nextStatePending = state;
		const nonCompliantValves = validateStateChange(state);

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


	return {
		confirmStateChange,
		instantStateChange,
	};
};