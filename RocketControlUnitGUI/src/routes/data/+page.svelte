<script lang="ts">
	import { getModalStore, SlideToggle, modeCurrent } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import PocketBase from 'pocketbase';

	const modalStore = getModalStore();

	const PB = new PocketBase('http://192.168.0.130:8090');
	
	PB.authStore.clear();

	async function writeLoadCellCommandMessage(target: string, command: string, weight_kg: number) {
		await PB.collection('LoadCellCommands').create({
			target: target,
			command: command,
			weight: weight_kg
		});
	}

	function confirmRemoveWeight(loadcell: string) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Remove All Weight',
			response: (r: boolean) => {
				if (r) {
					writeLoadCellCommandMessage(loadcell, "CALIBRATE", 0);
					promptEnterNumberOfWeights(loadcell);
				} else {
					writeLoadCellCommandMessage(loadcell, "CANCEL", 0);
				}
			}
		};
		modalStore.trigger(modal);
	}

	let numberOfWeights = 0;

	function promptEnterNumberOfWeights(loadcell: string) {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Enter number of weights',
			valueAttr: { type: 'number', required: true },
			response: async (r: any) => {
				if (r) {
					// The modal was confirmed, set the number of weights
					numberOfWeights = parseInt(r);
					if (numberOfWeights > 0) {
						promptEnterWeight(loadcell);
					}
				}
			}
		};
		modalStore.trigger(modal);
	}

	function promptEnterWeight(loadcell: string) {
		const modal: ModalSettings = {
			type: 'prompt',
			title: `Enter Weight (kg) (${numberOfWeights} remaining)`,
			valueAttr: { type: 'text', required: true },
			response: async (r: any) => {
				if (r) {
					// If this is the last weight, send the finish command
					if (numberOfWeights === 1) {
						writeLoadCellCommandMessage(loadcell, "FINISH", parseFloat(r));
					} else {
						// The modal was confirmed, send the calibrate command
						writeLoadCellCommandMessage(loadcell, "CALIBRATE", parseFloat(r));
					}

					// Decrease the number of weights and open the modal again if there are more weights to enter
					numberOfWeights--;
					if (numberOfWeights > 0) {
						promptEnterWeight(loadcell);
					}
				} else {
					// The modal was cancelled, send a cancel command
					writeLoadCellCommandMessage(loadcell, "CANCEL", 0);
				}
			}
		};
		modalStore.trigger(modal);
	}

	async function performTare(loadcell: string) {
		writeLoadCellCommandMessage(loadcell, "TARE", 0);
	}
</script>

<div class="data_container">
	<div class="lc1_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("LC1")}
		>
			TARE
		</button>
	</div>

	<div class="lc1_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommandMessage("LC1", "CANCEL", 0);
				confirmRemoveWeight("LC1");}}
		>
			CAL
		</button>
	</div>

	<div class="lc2_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("LC2")}
		>
			TARE
		</button>
	</div>

	<div class="lc2_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommandMessage("LC2", "CANCEL", 0);
				confirmRemoveWeight("LC2");}}
		>
			CAL
		</button>
	</div>

	<div class="lc3_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("LC3")}
		>
			TARE
		</button>
	</div>

	<div class="lc3_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommandMessage("LC3", "CANCEL", 0);
				confirmRemoveWeight("LC3");}}
		>
			CAL
		</button>
	</div>

	<div class="lc4_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("LC4")}
		>
			TARE
		</button>
	</div>

	<div class="lc4_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommandMessage("LC4", "CANCEL", 0);
				confirmRemoveWeight("LC4");}}
		>
			CAL
		</button>
	</div>

	<div class="lc5_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("LC5")}
		>
			TARE
		</button>
	</div>

	<div class="lc5_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommandMessage("LC5", "CANCEL", 0);
				confirmRemoveWeight("LC5");}}
		>
			CAL
		</button>
	</div>

	<div class="lc6_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("LC6")}
		>
			TARE
		</button>
	</div>

	<div class="lc6_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommandMessage("LC6", "CANCEL", 0);
				confirmRemoveWeight("LC6");}}
		>
			CAL
		</button>
	</div>
</div>
<style>

.data_container {
		position: relative;
		width: 100%;
		height: 100%;
	}

@media (min-width: 576px) {
	.data_container {
		max-width: 100%;
	}
}

.lc1_tare_button {
		position: absolute;
		top: calc(var(--container-width) * 0.118);
		left: 70%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc1_cal_button {
		position: absolute;
		top: calc(var(--container-width) * 0.144);
		left: 70%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc2_tare_button {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 70%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc2_cal_button {
		position: absolute;
		top: calc(var(--container-width) * 0.215);
		left: 70%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc3_tare_button {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 70%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc3_cal_button {
		position: absolute;
		top: calc(var(--container-width) * 0.301);
		left: 70%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc4_tare_button {
		position: absolute;
		top: calc(var(--container-width) * 0.118);
		left: 82%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc4_cal_button {
		position: absolute;
		top: calc(var(--container-width) * 0.144);
		left: 82%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc5_tare_button {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 82%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc5_cal_button {
		position: absolute;
		top: calc(var(--container-width) * 0.215);
		left: 82%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc6_tare_button {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 82%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}

	.lc6_cal_button {
		position: absolute;
		top: calc(var(--container-width) * 0.301);
		left: 82%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1900));
	}
</style>