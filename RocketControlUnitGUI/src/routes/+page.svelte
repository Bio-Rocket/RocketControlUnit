<script lang="ts">
	import { getModalStore, modeCurrent } from '@skeletonlabs/skeleton';
    import SlideToggle from "./SlideToggle.svelte"; 
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { currentState } from '../store';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import PocketBase from 'pocketbase';
	import BackgroundLight from './background.svelte';
	import { get } from 'svelte/store';

	const modalStore = getModalStore();

	const PB = new PocketBase('http://192.168.0.69:8090');

	let intervalId: ReturnType<typeof setInterval> | void;

	const StateArray = {
        Prefire_Valve_State: {
            PBV1: 'CLOSED',
            PBV2: 'OPEN',
            PBV3: 'CLOSED',
            PBV4: 'OPEN',
            PBV5: 'CLOSED',
            PBV6: 'CLOSED',
            PBV7: 'OPEN',
            PBV8: 'OPEN',
			SOL12: 'CLOSED',
            SOL13: 'CLOSED',
            PUMP3: 'OFF',
        },

        Ignition_Valve_State: {
            PBV1: 'CLOSED',
            PBV2: 'CLOSED',
            PBV3: 'CLOSED',
            PBV4: 'CLOSED',
			PBV5: 'CLOSED',
			PBV6: 'CLOSED',
            PBV7: 'CLOSED',
            PBV8: 'CLOSED',
			SOL12: 'CLOSED',
            SOL13: 'CLOSED',
            PUMP3: 'OFF',
        }
    };

	intervalId = setInterval(async () => {
		await PB.collection('Heartbeat').create({
			message: 'heartbeat'
		});
	}, 5000); // 5000 milliseconds = 5 seconds

	let nextStatePending: string = '';
	function confirmStateChange(state: string): void {
		nextStatePending = state;
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: `Are you sure you wish to proceed to ${commandToState[state]}?`,
			response: (r: boolean) => {
				if (r) {
					async function writeStateChange(state: string) {
						await PB.collection('CommandMessage').create({
							command: state
						});
					}
					writeStateChange(nextStatePending);
				}
				nextStatePending = '';
			}
		};
		modalStore.trigger(modal);
	}
	
	function instantStateChange(state: string): void {
		nextStatePending = state;
		async function writeStateChange(state: string) {
			// state string : contains the state to transition to
			await PB.collection('CommandMessage').create({
				command: state
			});
		}
		writeStateChange(nextStatePending);
		nextStatePending = '';
	}

	const stateToCommand: { [key: string]: string } = {
		ABORT: 'GOTO_ABORT',
		PREFIRE: 'GOTO_PREFIRE',
		FILL: 'GOTO_FILL',
		IGNITION: "GOTO_IGNITION",
		POSTFIRE: "SOFT_ABORT",
		TEST: "GOTO_TEST"
	};

	const commandToState = Object.fromEntries(
    	Object.entries(stateToCommand).map(([key, value]) => [value, key])
  	);

	let containerElement: any;

    onDestroy(() => {
        clearInterval(intervalId); // Stop the interval when the component is destroyed
    });

	onMount(() => {
		containerElement = document.querySelector('.container') as HTMLElement;

		// Define the resize handler
		const handleResize = () => {
			if (containerElement) {
				let containerWidth = containerElement.offsetWidth;
				let containerHeight = containerElement.offsetHeight;

				document.documentElement.style.setProperty('--container-width', `${containerWidth}px`);
				document.documentElement.style.setProperty('--container-height', `${containerHeight}px`);
				document.documentElement.style.setProperty(
					'--container-width-unitless',
					`${containerWidth}`
				);
			} else {
				console.error('No element with class "container" found');
			}
		};

		// Call the resize handler once on mount
		handleResize();

		// Attach the resize handler to the resize event
		window.addEventListener('resize', handleResize);

		// Return a cleanup function to remove the event listener when the component is destroyed
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	const warningState = writable("N/A");

	const pbv1_open = writable(undefined);
	const pbv2_open = writable(undefined);
	const pbv3_open = writable(undefined);
	const pbv4_open = writable(undefined);
	const pbv5_open = writable(undefined);
	const pbv6_open = writable(undefined);
	const pbv7_open = writable(undefined);
	const pbv8_open = writable(undefined);

	const pmp3_on = writable(undefined);

	const ign1_on = writable(undefined);
	const ign2_on = writable(undefined);

	const heater_on = writable(undefined);

	const tc1_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc2_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc3_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc4_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc5_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc6_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc7_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc8_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc9_temperature: Writable<string | number | undefined> = writable(undefined);

	const lc1_mass = writable(undefined);
	const lc2_mass = writable(undefined);
	const lc3_mass = writable(undefined);
	const lc4_mass = writable(undefined);
	const lc5_mass = writable(undefined);
	const lc6_mass = writable(undefined);

	const pt1_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt2_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt3_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt4_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt5_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt6_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt7_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt8_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt9_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt10_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt11_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt12_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt13_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt14_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt15_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt16_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt17_pressure: Writable<string | number | undefined> = writable(undefined);

	const sol12_open = writable(undefined);
	const sol13_open = writable(undefined);

	// const system_state: Writable<string | undefined> = writable(undefined);

	// const timer_state: Writable<string | undefined> = writable(undefined);
	// const timer_period: Writable<number | undefined> = writable(undefined);
	// const timer_remaining: Writable<number | undefined> = writable(undefined);

	$: pbv1_display = $pbv1_open === undefined ? 'N/A' : $pbv1_open ? 'OPEN' : 'CLOSED';
	$: pbv2_display = $pbv2_open === undefined ? 'N/A' : $pbv2_open ? 'CLOSED' : 'OPEN';
	$: pbv3_display = $pbv3_open === undefined ? 'N/A' : $pbv3_open ? 'OPEN' : 'CLOSED';
	$: pbv4_display = $pbv4_open === undefined ? 'N/A' : $pbv4_open ? 'CLOSED' : 'OPEN';
	$: pbv5_display = $pbv5_open === undefined ? 'N/A' : $pbv5_open ? 'OPEN' : 'CLOSED';
	$: pbv6_display = $pbv6_open === undefined ? 'N/A' : $pbv6_open ? 'OPEN' : 'CLOSED';
	$: pbv7_display = $pbv7_open === undefined ? 'N/A' : $pbv7_open ? 'CLOSED' : 'OPEN';
	$: pbv8_display = $pbv8_open === undefined ? 'N/A' : $pbv8_open ? 'CLOSED' : 'OPEN';

	$: pmp3_display = $pmp3_on === undefined ? 'N/A' : $pmp3_on ? 'ON' : 'OFF';

	$: ign1_display = $ign1_on === undefined ? 'N/A' : $ign1_on ? 'LIVE' : 'DEAD';
	$: ign2_display = $ign2_on === undefined ? 'N/A' : $ign2_on ? 'LIVE' : 'DEAD';

	$: heater_display = $heater_on === undefined ? 'N/A' : $heater_on ? 'ON' : 'OFF';

	$: tc1_display = $tc1_temperature === undefined ? 'N/A' : $tc1_temperature;
	$: tc2_display = $tc2_temperature === undefined ? 'N/A' : $tc2_temperature;
	$: tc3_display = $tc3_temperature === undefined ? 'N/A' : $tc3_temperature;
	$: tc4_display = $tc4_temperature === undefined ? 'N/A' : $tc4_temperature;
	$: tc5_display = $tc5_temperature === undefined ? 'N/A' : $tc5_temperature;
	$: tc6_display = $tc6_temperature === undefined ? 'N/A' : $tc6_temperature;
	$: tc7_display = $tc7_temperature === undefined ? 'N/A' : $tc7_temperature;
	$: tc8_display = $tc8_temperature === undefined ? 'N/A' : $tc8_temperature;
	$: tc9_display = $tc9_temperature === undefined ? 'N/A' : $tc9_temperature;

	$: lc1_mass_display = $lc1_mass === undefined ? 'N/A' : Number($lc1_mass).toFixed(2);
	$: lc2_mass_display = $lc2_mass === undefined ? 'N/A' : Number($lc2_mass).toFixed(2);
	$: lc3_mass_display = $lc3_mass === undefined ? 'N/A' : Number($lc3_mass).toFixed(2);
	$: lc4_mass_display = $lc4_mass === undefined ? 'N/A' : Number($lc4_mass).toFixed(2);
	$: lc5_mass_display = $lc5_mass === undefined ? 'N/A' : Number($lc5_mass).toFixed(2);
	$: lc6_mass_display = $lc6_mass === undefined ? 'N/A' : Number($lc6_mass).toFixed(2);

	$: pt1_pressure_display = $pt1_pressure === undefined ? 'N/A' : $pt1_pressure;
	$: pt2_pressure_display = $pt2_pressure === undefined ? 'N/A' : $pt2_pressure;
	$: pt3_pressure_display = $pt3_pressure === undefined ? 'N/A' : $pt3_pressure;
	$: pt4_pressure_display = $pt4_pressure === undefined ? 'N/A' : $pt4_pressure;
	$: pt5_pressure_display = $pt5_pressure === undefined ? 'N/A' : $pt5_pressure;
	$: pt6_pressure_display = $pt6_pressure === undefined ? 'N/A' : $pt6_pressure;
	$: pt7_pressure_display = $pt7_pressure === undefined ? 'N/A' : $pt7_pressure;
	$: pt8_pressure_display = $pt8_pressure === undefined ? 'N/A' : $pt8_pressure;
	$: pt9_pressure_display = $pt9_pressure === undefined ? 'N/A' : $pt9_pressure;
	$: pt10_pressure_display = $pt10_pressure === undefined ? 'N/A' : $pt10_pressure;
	$: pt11_pressure_display = $pt11_pressure === undefined ? 'N/A' : $pt11_pressure;
	$: pt12_pressure_display = $pt12_pressure === undefined ? 'N/A' : $pt12_pressure;
	$: pt13_pressure_display = $pt13_pressure === undefined ? 'N/A' : $pt13_pressure;
	$: pt14_pressure_display = $pt14_pressure === undefined ? 'N/A' : $pt14_pressure;
	$: pt15_pressure_display = $pt15_pressure === undefined ? 'N/A' : $pt15_pressure;
	$: pt16_pressure_display = $pt16_pressure === undefined ? 'N/A' : $pt16_pressure;
	$: pt17_pressure_display = $pt17_pressure === undefined ? 'N/A' : $pt17_pressure;

	$: sol12_display = $sol12_open === undefined ? 'N/A' : $sol12_open ? 'OPEN' : 'CLOSED';
	$: sol13_display = $sol13_open === undefined ? 'N/A' : $sol13_open ? 'OPEN' : 'CLOSED';

	// $: system_state_display = $system_state === undefined 
    // ? 'N/A' 
    // : $system_state.replace('SYS_', '');

	// $: timer_state_display = $timer_state === undefined ? 'N/A' : $timer_state;

	// $: timer_period_display = $timer_period === undefined 
    // ? 'N/A' 
    // : ($timer_period / 1000).toFixed(0); // Convert to seconds

	// $: timer_remaining_display = $timer_remaining === undefined 
	// ? 'N/A' 
	// : ($timer_remaining / 1000).toFixed(0); // Convert to seconds

	let plcitter = 0;
	
	onMount(async () => {
		PB.collection('Plc').subscribe('*', function (e) {
			tc1_temperature.set(e.record.TC1);
			tc2_temperature.set(e.record.TC2);
			tc3_temperature.set(e.record.TC3);
			tc4_temperature.set(e.record.TC4);
			tc5_temperature.set(e.record.TC5);
			tc6_temperature.set(e.record.TC6);
			tc7_temperature.set(e.record.TC7);
			tc8_temperature.set(e.record.TC8);
			tc9_temperature.set(e.record.TC9);
			lc1_mass.set(e.record.LC1);
			lc2_mass.set(e.record.LC2);
			pt1_pressure.set(Math.round(e.record.PT1_voltage) * 145);
			pt2_pressure.set(Math.round(e.record.PT2_voltage) * 145);
			pt3_pressure.set(Math.round(e.record.PT3_voltage) * 145);
			pt4_pressure.set(Math.round(e.record.PT4_voltage) * 145);
			pt5_pressure.set(Math.round(e.record.PT5_voltage) * 580);
			pt6_pressure.set(Math.round(e.record.PT6_voltage) * 580);
			pt15_pressure.set(Math.round(e.record.PT15_voltage) * 14.5);
			pt16_pressure.set(Math.round(e.record.PT16_voltage) * 14.5);
			pt17_pressure.set(Math.round(e.record.PT17_voltage) * 14.5);
			pbv1_open.set(e.record.PBV1);
			pbv2_open.set(e.record.PBV2);
			pbv3_open.set(e.record.PBV3);
			pbv4_open.set(e.record.PBV4);
			pbv5_open.set(e.record.PBV5);
			pbv6_open.set(e.record.PBV6);
			pbv7_open.set(e.record.PBV7);
			pbv8_open.set(e.record.PBV8);
			pmp3_on.set(e.record.PMP3);
			sol12_open.set(e.record.SOL12);
			sol13_open.set(e.record.SOL13);
			ign1_on.set(e.record.IGN1);
			ign2_on.set(e.record.IGN2);
			heater_on.set(e.record.HEATER);
		});
	
			// Query the most recent record from 'LabJack1' collection
			// const labJack1Record = await PB.collection('LabJack1').getFirstListItem("", { sort: '-created' })
			// const labJack1Data = labJack1Record.lj1_data;

			// sol1_open.set(labJack1Data[0]);
			// sol2_open.set(labJack1Data[1]);
			// sol3_open.set(labJack1Data[2]);
			// sol4_open.set(labJack1Data[3]);
			// pt7_pressure.set(labJack1Data[4]);
			// pt8_pressure.set(labJack1Data[5]);
			// pt9_pressure.set(labJack1Data[6]);
			// pt10_pressure.set(labJack1Data[7]);
			// pt11_pressure.set(labJack1Data[8]);
			// pt12_pressure.set(labJack1Data[9]);

	});	

	$: classesDisabled = $currentState === "PREFIRE" ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-[105%] dark:hover:brightness-110 cursor-pointer';

	async function handlePlcSliderChange(
		e: any,
		openCommand: string,
		closeCommand: string
	) {
		e.preventDefault();

		// Determine the command based on the current value of the slider
		const command = e.target.checked ? openCommand : closeCommand;

		// Create a change on the 'RelayStatus' collection
		await PB.collection('PlcCommands').create({
			// Write a new record with all current values
			loadcell: null,
			command: command,
			value: null
		});
	}

	let wasLiveAtAnyPoint = false;

	async function pollIgnitors() {
		if (ign1_display === 'LIVE' || ign2_display === 'LIVE') {
			wasLiveAtAnyPoint = true;
		}
	}

	async function handleLaunchSequence() {
		await PB.collection('PlcCommands').create({
			command: 'IGN1_ON'
		});

		await PB.collection('PlcCommands').create({
			command: 'IGN2_ON'
		});

		const pollInterval = setInterval(pollIgnitors, 100);

		await new Promise(resolve => setTimeout(resolve, 3500));

		clearInterval(pollInterval);

		if (wasLiveAtAnyPoint) {
			for (let i = 0; i < 3; i++) {
				await PB.collection('PlcCommands').create({
					command: 'RSC_IGNITION_TO_LAUNCH'
				});
				await new Promise(resolve => setTimeout(resolve, 100));
			} 
		}
		wasLiveAtAnyPoint = false;
	}

	// NOTE: This seems odd but since the event will switch these MUST be swapped
	// Open to alternate ways of doing it. Everything I tried didn't work.
	async function handleIgnition(e: MouseEvent) {
		await handlePlcSliderChange(e, 'IGN1_ON', 'IGN1_OFF');
		await handlePlcSliderChange(e, 'IGN2_OFF', 'IGN2_ON');
	}

	function checkStateAndChangePrefire() {
		const currentState = {
			PBV1: get(pbv1_open),
			PBV2: get(pbv2_open),
			PBV3: get(pbv3_open),
			PBV4: get(pbv4_open),
			PBV5: get(pbv5_open),
			PBV6: get(pbv6_open),
			PBV7: get(pbv7_open),
			PBV8: get(pbv8_open),
			SOL12: get(sol12_open),
			SOL13: get(sol13_open),
			PUMP3: get(pmp3_on),
		};

    	const prefireState = StateArray.Prefire_Valve_State;

		const isEqual = Object.keys(prefireState).every(key => {
		const currentValue = currentState[key as keyof typeof currentState];
		const prefireValue = prefireState[key as keyof typeof prefireState];
		return currentValue === prefireValue || (currentValue === undefined && prefireValue === undefined);
		});

		if (isEqual) {
			instantStateChange("GOTO_PREFIRE");
		} else {
			confirmStateChange("GOTO_PREFIRE");
		}
	}

	function checkStateAndChangeIgnition() {
		const currentState = {
			PBV1: get(pbv1_open),
			PBV2: get(pbv2_open),
			PBV3: get(pbv3_open),
			PBV4: get(pbv4_open),
			PBV5: get(pbv5_open),
			PBV6: get(pbv6_open),
			PBV7: get(pbv7_open),
			PBV8: get(pbv8_open),
			SOL12: get(sol12_open),
			SOL13: get(sol13_open),
			PUMP3: get(pmp3_on),
		};

		const ignitionState = StateArray.Ignition_Valve_State;

		const isEqual = Object.keys(ignitionState).every(key => {
		const currentValue = currentState[key as keyof typeof currentState];
		const ignitionValue = ignitionState[key as keyof typeof ignitionState];
		return currentValue === ignitionValue || (currentValue === undefined && ignitionValue === undefined);
		});

		if (isEqual) {
			instantStateChange("GOTO_IGNITION");
		} else {
			confirmStateChange("GOTO_IGNITION");
		}
  	}

</script>

<div class="container">
	<svelte:component this={BackgroundLight} />

	<div class="pbv1_slider">
		<SlideToggle
			name="pbv1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv1_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV1_OPEN', 'PBV1_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv1_display}</SlideToggle
		>
	</div>

	<div class="pbv2_slider">
		<SlideToggle
			name="pbv2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv2_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV2_OPEN', 'PBV2_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv2_display}</SlideToggle
		>
	</div>

	<div class="pbv3_slider">
		<SlideToggle
			name="pbv3_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv3_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV3_OPEN', 'PBV3_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv3_display}</SlideToggle
		>
	</div>

	<div class="pbv4_slider">
		<SlideToggle
			name="pbv4_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv4_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV4_OPEN', 'PBV4_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv4_display}</SlideToggle
		>
	</div>

	<div class="pbv5_slider">
		<SlideToggle
			name="pbv5_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv5_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV5_OPEN', 'PBV5_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv5_display}</SlideToggle
		>
	</div>

	<div class="pbv6_slider">
		<SlideToggle
			name="pbv6_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv6_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV6_OPEN', 'PBV6_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv6_display}</SlideToggle
		>
	</div>

	<div class="pbv7_slider">
		<SlideToggle
			name="pbv7_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv7_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV7_OPEN', 'PBV7_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv7_display}</SlideToggle
		>
	</div>

	<div class="pbv8_slider">
		<SlideToggle
			name="pbv8_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv8_open}
			on:click={(e) => handlePlcSliderChange(e, 'PBV8_OPEN', 'PBV8_CLOSE')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv8_display}</SlideToggle
		>
	</div>

	<div class="pmp3_slider">
		<SlideToggle
			name="pmp3_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pmp3_on}
			on:click={(e) => handlePlcSliderChange(e, 'PMP3_ON', 'PMP3_OFF')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pmp3_display}</SlideToggle
		>
	</div>

	<div class="sol12_slider">
		<SlideToggle
			name="sol12_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol12_open}
			on:click={(e) => handlePlcSliderChange(e, 'SOL12_OPEN', 'SOL12_CLOSED')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{sol12_display}</SlideToggle
		>
	</div>

	<div class="sol13_slider">
		<SlideToggle
			name="sol13_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol13_open}
			on:click={(e) => handlePlcSliderChange(e, 'SOL13_OPEN', 'SOL13_CLOSED')}
			disabled={["PREFIRE", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{sol13_display}</SlideToggle
		>
	</div>

	<div class="heater_slider">
		<SlideToggle
			name="heater_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$heater_on}
			on:click={(e) => handlePlcSliderChange(e, 'HEATER_ON', 'HEATER_OFF')}
		>
			{heater_display}</SlideToggle
		>
	</div>


	<div class="ign1_slider">
		<SlideToggle
			name="ign1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$ign1_on}
			on:click={handleIgnition}
			disabled={["PREFIRE", "MANUAL_FILL", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{ign1_display}</SlideToggle
		>
	</div>

	<div class="ign2_slider">
		<SlideToggle
			name="ign2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$ign2_on}
			on:click={handleIgnition}
			disabled={["PREFIRE", "MANUAL_FILL", "IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{ign2_display}</SlideToggle
		>
	</div>

	<div class="tc1_temperature">
		<p>{tc1_display}</p>
	</div>

	<div class="tc2_temperature">
		<p>{tc2_display}</p>
	</div>

	<div class="tc3_temperature">
		<p>{tc3_display}</p>
	</div>

	<div class="tc4_temperature">
		<p>{tc4_display}</p>
	</div>

	<div class="tc5_temperature">
		<p>{tc5_display}</p>
	</div>

	<div class="tc6_temperature">
		<p>{tc6_display}</p>
	</div>

	<div class="tc7_temperature">
		<p>{tc7_display}</p>
	</div>

	<div class="tc8_temperature">
		<p>{tc8_display}</p>
	</div>

	<div class="tc9_temperature">
		<p>{tc9_display}</p>
	</div>

	<div class="lc1_mass">
		<p>{lc1_mass_display}</p>
	</div>

	<div class="lc2_mass">
		<p>{lc2_mass_display}</p>
	</div>

	<div class="lc3_mass">
		<p>{lc3_mass_display}</p>
	</div>

	<div class="lc4_mass">
		<p>{lc4_mass_display}</p>
	</div>

	<div class="lc5_mass">
		<p>{lc5_mass_display}</p>
	</div>

	<div class="lc6_mass">
		<p>{lc6_mass_display}</p>
	</div>

	<div class="pt1_pressure">
		<p>{pt1_pressure_display}</p>
	</div>

	<div class="pt2_pressure">
		<p>{pt2_pressure_display}</p>
	</div>

	<div class="pt3_pressure">
		<p>{pt3_pressure_display}</p>
	</div>

	<div class="pt4_pressure">
		<p>{pt4_pressure_display}</p>
	</div>

	<div class="pt5_pressure">
		<p>{pt5_pressure_display}</p>
	</div>

	<div class="pt6_pressure">
		<p>{pt6_pressure_display}</p>
	</div>

	<div class="pt7_pressure">
		<p>{pt7_pressure_display}</p>
	</div>

	<div class="pt8_pressure">
		<p>{pt8_pressure_display}</p>
	</div>

	<div class="pt9_pressure">
		<p>{pt9_pressure_display}</p>
	</div>

	<div class="pt10_pressure">
		<p>{pt10_pressure_display}</p>
	</div>

	<div class="pt11_pressure">
		<p>{pt11_pressure_display}</p>
	</div>

	<div class="pt12_pressure">
		<p>{pt12_pressure_display}</p>
	</div>

	<div class="pt13_pressure">
		<p>{pt13_pressure_display}</p>
	</div>

	<div class="pt14_pressure">
		<p>{pt14_pressure_display}</p>
	</div>

	<div class="pt15_pressure">
		<p>{pt15_pressure_display}</p>
	</div>

	<div class="pt16_pressure">
		<p>{pt16_pressure_display}</p>
	</div>

	<div class="pt17_pressure">
		<p>{pt17_pressure_display}</p>
	</div>
<!--
	<div class="system_state">
		<p>{system_state_display}</p>
	</div>

	<div class="timer_state">
		<p>{timer_state_display}</p>
	</div>

	<div class="timer_period">
		<p>{timer_period_display}</p>
	</div>

	<div class="timer_remaining">
		<p>{timer_remaining_display}</p>
	</div> -->

	<!-- Render different buttons based on the current state -->
	{#if $currentState == "PREFIRE"}
		<button
			class="btn variant-filled-primary next-state-btn"
			style="left: 20%"
			on:click={() => instantStateChange("GOTO_FILL")}>Go to Fill</button
		>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="left: 33%"
			on:click={() => instantStateChange("GOTO_TEST")}>Go to Test</button
		>
	{:else if $currentState == "FILL"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="left: 33%"
			on:click={() => checkStateAndChangePrefire()}>Go to Pre-Fire</button
		>
		<button
			class="btn variant-filled-warning next-state-btn"
			style="left: 20%"
			on:click={() => checkStateAndChangeIgnition()}>Go to Ignition</button
		>
	{:else if $currentState == "IGNITION"}
		<button
			class="btn variant-filled next-state-btn fire-btn"
			style="left:20%"
			on:click={() => handleLaunchSequence()}>FIRE</button
		>
		<button
			class="btn variant-filled-warning next-state-btn"
			style="left: 7%"
			on:click={() => instantStateChange("SOFT_ABORT")}>Soft Abort</button
		>
		<button
			class="btn variant-filled-surface next-state-btn"
			style="left: 33%"
			on:click={() => confirmStateChange("GOTO_FILL")}>Go to Fill</button
		>
	{:else if $currentState == "FIRE"}
		<button
			class="btn variant-filled-warning next-state-btn"
			style="left: 7%"
			on:click={() => instantStateChange("SOFT_ABORT")}>Soft Abort</button
		>
	{:else if $currentState == "TEST"}
		<button
		class="btn variant-filled-secondary next-state-btn"
		style="left: 7%"
		on:click={() => confirmStateChange("GOTO_PREFIRE")}>Go to Pre-Fire</button
		>
	{/if}
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	@media (min-width: 576px) {
		.container {
			max-width: 100%;
		}
	}

	.next-state-btn {
		position: absolute;
		top: calc(var(--container-width) * 0.532);
		width: 200px;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1600));
	}

	.fire-btn {
		background-color: #d4163c;
	}

	.pbv1_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.125);
		left: 17%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pbv2_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.055);
		left: 34%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pbv3_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.275);
		left: 19%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pbv4_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.23);
		left: 34%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pbv5_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.107);
		left: 84%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pbv6_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.109);
		left: 95.8%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pbv7_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.345);
		left: 42.6%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pbv8_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.273);
		left: 50%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.pmp3_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.321);
		left: 84%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.sol12_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.395);
		left: 29%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.sol13_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.46);
		left: 29%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.ign1_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.41);
		left: 86%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.ign2_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.425);
		left: 86%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.heater_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.452);
		left: 10.8%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.tc1_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 10.75%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc2_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.441);
		left: 55.45%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc3_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.218);
		left: 87.6%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc4_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.218);
		left: 96.4%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc5_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.2635);
		left: 89%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc6_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.37);
		left: 89%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc7_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.318);
		left: 97.6%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc8_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.363);
		left: 95.3%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc9_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.4115);
		left: 10.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc1_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.385);
		left: 5.4%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc2_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.485);
		left: 5.3%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc3_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.175);
		left: 60.2%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc4_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.298);
		left: 60.2%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc5_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.42);
		left: 60.2%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc6_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.313);
		left: 92.05%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt1_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.12);
		left: 9.25%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt2_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.1205);
		left: 22.4%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt3_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.122);
		left: 29.15%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt4_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 7.1%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt5_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.3421);
		left: 22.4%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt6_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 29%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt7_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.111);
		left: 56.75%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt8_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.111);
		left: 63.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt9_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.3145);
		left: 51.35%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt10_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.3145);
		left: 54.85%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt11_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.441);
		left: 48.25%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt12_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.44);
		left: 51.83%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt13_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.183);
		left: 87.6%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt14_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.183);
		left: 96.4%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt15_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.264);
		left: 85.38%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt16_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.37);
		left: 85.38%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt17_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.424);
		left: 21.15%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

/*
	.system_state {
		position: absolute;
		top: calc(var(--container-width) * 0.373);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 12px;
	}

	.timer_state {
		position: absolute;
		top: calc(var(--container-width) * 0.386);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 12px;
	}

	.timer_period {
		position: absolute;
		top: calc(var(--container-width) * 0.399);
		left: 44%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 12px;
	}

	.timer_remaining {
		position: absolute;
		top: calc(var(--container-width) * 0.413);
		left: 45%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 12px;
	} */
</style>