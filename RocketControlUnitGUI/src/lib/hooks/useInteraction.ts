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

Object.freeze(stateToCommand);
Object.freeze(commandToState);

export const useInteraction = (pocketbaseHook: PocketbaseHook) => {
	const modalStore = getModalStore();

	let nextStatePending: string = '';

	const confirmStateChange = (state: string) => {
		nextStatePending = state;

		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: `Are you sure you wish to proceed to ${commandToState[state]}?`,
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