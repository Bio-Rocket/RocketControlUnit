import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
import type { PocketbaseHook } from './usePocketbase';
import PausablePromptModal, { type PausablePromptResponse } from '$lib/components/PausablePromptModal.svelte';

const stateToCommand: { [key: string]: string } = {
    ABORT: 'GOTO_ABORT',
    PREFIRE: 'GOTO_PREFIRE',
	PRELAUNCH: 'GOTO_PRELAUNCH',
    FILL: 'GOTO_FILL',
    IGNITION: "GOTO_IGNITION",
    POSTFIRE: "GOTO_POSTFIRE",
	POSTLAUNCH: "GOTO_POSTLAUNCH",
    TEST: "GOTO_TEST"
};

const commandToState = Object.fromEntries(
	Object.entries(stateToCommand).map(([key, value]) => [value, key])
);

Object.freeze(stateToCommand);
Object.freeze(commandToState);

interface LoadCellPromptStates {
	[loadcell: string]: {
		numberOfWeights: number,
		onResume?: (loadcell: string) => void
	}
}

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

	let promptStates: LoadCellPromptStates = {}

	const confirmRemoveWeight = (loadcell: string) => {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Remove All Weight',
			response: (r: boolean) => {
				if (r) {
					pocketbaseHook.writeLoadCellCommand(loadcell, 'CALIBRATE', 0);
					promptEnterNumberOfWeights(loadcell);
				} else {
					pocketbaseHook.writeLoadCellCommand(loadcell, 'CANCEL', 0);
				}
			}
		};

		modalStore.trigger(modal);
	};

	const promptEnterNumberOfWeights = (loadcell: string) => {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Enter number of weights',
			valueAttr: { type: 'number', required: true },
			response: async (r: any) => {
				if (r) {
					// The modal was confirmed, set the number of weights
					promptStates[loadcell] = {
						numberOfWeights: parseInt(r)
					};

					if (promptStates[loadcell].numberOfWeights > 0) {
						promptEnterWeight(loadcell);
					}
				}
				else {
					delete promptStates[loadcell];
				}
			}
		};

		modalStore.trigger(modal);
	};

	const promptEnterWeight = (loadcell: string) => {
		const modalComponent: ModalComponent = {
			ref: PausablePromptModal,
			props: {
				heading: `Enter Weight (kg) (${promptStates[loadcell].numberOfWeights} remaining)`,
			}
		};

		let shouldReRun = false;

		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent,
			response: (res: PausablePromptResponse) => {
				switch (res[0]) {
					case 'submit':
						// If this is the last weight, send the finish command
						if (promptStates[loadcell].numberOfWeights === 1) {
							pocketbaseHook.writeLoadCellCommand(loadcell, 'FINISH', parseFloat(res[1]));

							delete promptStates[loadcell];
							return;
						} else {
							// The modal was confirmed, send the calibrate command
							pocketbaseHook.writeLoadCellCommand(loadcell, 'CALIBRATE', parseFloat(res[1]));
						}

						// Decrease the number of weights and open the modal again if there are more weights to enter
						promptStates[loadcell].numberOfWeights--;
						if (promptStates[loadcell].numberOfWeights > 0) {
							promptEnterWeight(loadcell);
						}

						break;
					case 'pause':
						promptStates[loadcell].onResume = promptEnterWeight;
						break;
					default:	// 'cancel' | undefined
						pocketbaseHook.writeLoadCellCommand(loadcell, 'CANCEL', 0);
						delete promptStates[loadcell];
						break;
				}
			}
		};

		modalStore.trigger(modal);
	};

	const resumeConfirmRemoveWeight = (loadcell: string) => {
		if (!promptStates[loadcell] || !promptStates[loadcell].onResume) {
			confirmRemoveWeight(loadcell);
			return;
		}

		promptStates[loadcell].onResume!(loadcell);
	}

	return {
		confirmStateChange,
		instantStateChange,
		resumeConfirmRemoveWeight,
	};
};