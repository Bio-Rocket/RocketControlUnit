<script lang="ts">
	import { getModalStore, SlideToggle, modeCurrent } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { currentState } from '../store';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import PocketBase from 'pocketbase';
	import BackgroundDark from './background-dark.svelte';
	import BackgroundLight from './fort.svelte';
	import { auth } from '../store';

	import SolTesting from './sol_testing.svelte';

	const modalStore = getModalStore();

	const PB = new PocketBase('http://192.168.0.130:8090');

	// onMount(async () => {
	// 	const email = import.meta.env.VITE_EMAIL;
	// 	const password = import.meta.env.VITE_PASSWORD;
	// 	if (email && password) {
	// 		await PB.admins.authWithPassword(email, password);
	// 		$auth = true;
	// 	}

	// 	if ($auth === true) {
	// 		intervalId = setInterval(async () => {
	// 			await PB.collection('Heartbeat').create({
	// 				message: 'heartbeat'
	// 			});
	// 		}, 5000); // 5000 milliseconds = 5 seconds
	// 	}
	// });

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
							target: 'NODE_DMB',
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
				target: 'NODE_DMB',
				command: state
			});
		}
		writeStateChange(nextStatePending);
		nextStatePending = '';
	}

	const stateToCommand: { [key: string]: string } = {
		RS_ABORT: 'RSC_ANY_TO_ABORT',
		RS_PRELAUNCH: 'RSC_GOTO_PRELAUNCH',
		RS_FILL: "RSC_GOTO_FILL",
		RS_ARM: "RSC_GOTO_ARM",
		RS_IGNITION: "RSC_GOTO_IGNITION",
		RS_LAUNCH: "RSC_IGNITION_TO_LAUNCH",
		RS_BURN: "RSC_GOTO_BURN",
		RS_COAST: "RSC_GOTO_COAST",
		RS_DESCENT: "RSC_GOTO_DESCENT",
		RS_RECOVERY: "RSC_GOTO_RECOVERY",
		RS_TEST: "RSC_GOTO_TEST"
	};

	const commandToState = Object.fromEntries(
    	Object.entries(stateToCommand).map(([key, value]) => [value, key])
  	);

    // let BackgroundComponent: any;

    // $: {
    //     if ($modeCurrent) {
    //         BackgroundComponent = BackgroundLight;
    //     } else {
    //         BackgroundComponent = BackgroundDark;
    //     }
    // }

	let containerElement: any;
	let intervalId: any;

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

	const pbv1_open = writable(undefined);
	const pbv2_open = writable(undefined);
	const pbv3_open = writable(undefined);
	const pbv4_open = writable(undefined);
	const pbv5_open = writable(undefined);
	const pbv6_open = writable(undefined);
	const pbv7_open = writable(undefined);
	const pbv8_open = writable(undefined);

	const sol1_open = writable(undefined);
	const sol2_open = writable(undefined);
	const sol3_open = writable(undefined);
	const sol4_open = writable(undefined);

	const sol_test_open = writable(undefined);

	const ign1_on = writable(undefined);
	const ign2_on = writable(undefined);

	const tc1_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc2_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc3_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc4_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc5_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc6_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc7_temperature: Writable<string | number | undefined> = writable(undefined);
	const tc8_temperature: Writable<string | number | undefined> = writable(undefined);

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

	const pt1_test_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt2_test_pressure: Writable<string | number | undefined> = writable(undefined);

	const system_state: Writable<string | undefined> = writable(undefined);

	const timer_state: Writable<string | undefined> = writable(undefined);
	const timer_period: Writable<number | undefined> = writable(undefined);
	const timer_remaining: Writable<number | undefined> = writable(undefined);

	$: pbv1_display = $pbv1_open === undefined ? 'N/A' : $pbv1_open ? 'OPEN' : 'CLOSED';
	$: pbv2_display = $pbv2_open === undefined ? 'N/A' : $pbv2_open ? 'CLOSED' : 'OPEN';
	$: pbv3_display = $pbv3_open === undefined ? 'N/A' : $pbv3_open ? 'OPEN' : 'CLOSED';
	$: pbv4_display = $pbv4_open === undefined ? 'N/A' : $pbv4_open ? 'CLOSED' : 'OPEN';
	$: pbv5_display = $pbv5_open === undefined ? 'N/A' : $pbv5_open ? 'OPEN' : 'CLOSED';
	$: pbv6_display = $pbv6_open === undefined ? 'N/A' : $pbv6_open ? 'OPEN' : 'CLOSED';
	$: pbv7_display = $pbv7_open === undefined ? 'N/A' : $pbv7_open ? 'CLOSED' : 'OPEN';
	$: pbv8_display = $pbv8_open === undefined ? 'N/A' : $pbv8_open ? 'CLOSED' : 'OPEN';

	$: sol1_display = $sol1_open === undefined ? 'N/A' : $sol1_open ? 'OPEN' : 'CLOSED';
	$: sol2_display = $sol2_open === undefined ? 'N/A' : $sol2_open ? 'OPEN' : 'CLOSED';
	$: sol3_display = $sol3_open === undefined ? 'N/A' : $sol3_open ? 'OPEN' : 'CLOSED';
	$: sol4_display = $sol4_open === undefined ? 'N/A' : $sol4_open ? 'OPEN' : 'CLOSED';

	$: sol_test_display = $sol_test_open === undefined ? 'N/A' : $sol_test_open ? 'OPEN' : 'CLOSED';

	$: ign1_display = $ign1_on === undefined ? 'N/A' : $ign1_on ? 'LIVE' : 'DEAD';
	$: ign2_display = $ign2_on === undefined ? 'N/A' : $ign2_on ? 'LIVE' : 'DEAD';

	$: tc1_display = $tc1_temperature === undefined ? 'N/A' : $tc1_temperature;
	$: tc2_display = $tc2_temperature === undefined ? 'N/A' : $tc2_temperature;
	$: tc3_display = $tc3_temperature === undefined ? 'N/A' : $tc3_temperature;
	$: tc4_display = $tc4_temperature === undefined ? 'N/A' : $tc4_temperature;
	$: tc5_display = $tc5_temperature === undefined ? 'N/A' : $tc5_temperature;
	$: tc6_display = $tc6_temperature === undefined ? 'N/A' : $tc6_temperature;
	$: tc7_display = $tc7_temperature === undefined ? 'N/A' : $tc7_temperature;
	$: tc8_display = $tc8_temperature === undefined ? 'N/A' : $tc8_temperature;

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

	$: pt1_test_pressure_display = $pt1_test_pressure === undefined ? 'N/A' : $pt1_test_pressure;
	$: pt2_test_pressure_display = $pt2_test_pressure === undefined ? 'N/A' : $pt2_test_pressure;

	$: system_state_display = $system_state === undefined 
    ? 'N/A' 
    : $system_state.replace('SYS_', '');

	$: timer_state_display = $timer_state === undefined ? 'N/A' : $timer_state;

	$: timer_period_display = $timer_period === undefined 
    ? 'N/A' 
    : ($timer_period / 1000).toFixed(0); // Convert to seconds

	$: timer_remaining_display = $timer_remaining === undefined 
	? 'N/A' 
	: ($timer_remaining / 1000).toFixed(0); // Convert to seconds

	onMount(() => {
		const interval = setInterval(async () => {
		try {
			// Query the most recent record from 'LabJack1' collection
			const labJack1Record = await PB.collection('LabJack1').getFirstListItem("", { sort: '-created' })
			const labJack1Data = labJack1Record.lj1_data;
			pt1_test_pressure.set(labJack1Data[0]);
			pt2_test_pressure.set(labJack1Data[1]);

			const plcRecord = await PB.collection('PLC').getFirstListItem("", { sort: '-created' })
			const plcData = plcRecord.plc_data;
			sol_test_open.set(plcData[0]);

		} catch (error) {
			console.error('Error querying records:', error);
		}
		}, 200);

		return () => clearInterval(interval);
	});

	async function handleLabJackSliderChange(
		e: any,
		openCommand: string,
		closeCommand: string
	) {
		e.preventDefault();

		// Determine the command based on the current value of the slider
		const command = e.target.checked ? openCommand : closeCommand;

		// Create a change on the 'RelayStatus' collection
		await PB.collection('LabJack1Commands').create({
			// Write a new record with all current values
			command: command
		});
	}

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
			command: command
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
			command: 'RCU_IGNITE_PAD_BOX1'
		});

		await PB.collection('PlcCommands').create({
			command: 'RCU_IGNITE_PAD_BOX2'
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
		await handlePlcSliderChange(e, 'RCU_IGNITE_PAD_BOX1', 'RCU_KILL_BOX1');
		await handlePlcSliderChange(e, 'RCU_KILL_PAD_BOX2', 'RCU_IGNITE_PAD_BOX2');
	}

</script>

<div class="container">
	<svelte:component this={SolTesting} />

	<div class="pbv1_slider">
		<SlideToggle
			name="pbv1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv1_open}
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV1', 'CLOSE_PBV1')}
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
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV2', 'CLOSE_PBV2')}
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
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV3', 'CLOSE_PBV3')}
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
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV4', 'CLOSE_PBV4')}
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
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV5', 'CLOSE_PBV5')}
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
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV6', 'CLOSE_PBV6')}
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
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV7', 'CLOSE_PBV7')}
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
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_PBV8', 'CLOSE_PBV8')}
		>
			{pbv8_display}</SlideToggle
		>
	</div>

	<div class="sol1_slider">
		<SlideToggle
			name="sol1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol1_open}
			on:click={(e) => handleLabJackSliderChange(e, 'OPEN_SOL1', 'CLOSE_SOL1')}
		>
			{sol1_display}</SlideToggle
		>
	</div>

	<div class="sol2_slider">
		<SlideToggle
			name="sol2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol2_open}
			on:click={(e) => handleLabJackSliderChange(e, 'OPEN_SOL2', 'CLOSE_SOL2')}
		>
			{sol2_display}</SlideToggle
		>
	</div>

	<div class="sol3_slider">
		<SlideToggle
			name="sol3_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol3_open}
			on:click={(e) => handleLabJackSliderChange(e, 'OPEN_SOL3', 'CLOSE_SOL3')}
		>
			{sol3_display}</SlideToggle
		>
	</div>

	<div class="sol4_slider">
		<SlideToggle
			name="sol4_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol4_open}
			on:click={(e) => handleLabJackSliderChange(e, 'OPEN_SOL4', 'CLOSE_SOL4')}
		>
			{sol4_display}</SlideToggle
		>
	</div>

	<div class="test_sol_slider">
		<SlideToggle
			name="test_sol_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol_test_open}
			on:click={(e) => handlePlcSliderChange(e, 'OPEN_SOL', 'CLOSE_SOL')}
		>
			{sol_test_display}</SlideToggle
		>
	</div>

	{#if $currentState === "N/A" || $currentState === "RS_IGNITION" || $currentState === "RS_TEST" || $currentState === "RS_ABORT" || $currentState === "RS_LAUNCH" || $currentState === "RS_BURN" || $currentState === "RS_COAST" || $currentState === "RS_RECOVERY"}
		<div class="ign1_slider">
			<SlideToggle
				name="ign1_slider"
				active="bg-primary-500 dark:bg-primary-500"
				size="sm"
				bind:checked={$ign1_on}
				on:click={handleIgnition}
				disabled={$currentState === "RS_IGNITION" || $currentState === "RS_ABORT" || $currentState === "RS_LAUNCH" || $currentState === "RS_BURN" || $currentState === "RS_COAST" || $currentState === "RS_RECOVERY"}
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
				disabled={$currentState === "RS_IGNITION" || $currentState === "RS_ABORT" || $currentState === "RS_LAUNCH" || $currentState === "RS_BURN" || $currentState === "RS_COAST" || $currentState === "RS_RECOVERY"}
			>
				{ign2_display}</SlideToggle
			>
		</div>
	{/if}

	<div class="tc1_temperature">
		<p>{tc1_display}</p>
	</div>

	<div class="tc2_temperature">
		<p>{tc2_display}</p>
	</div>

	<div class="pt1_test_pressure">
		<p>{pt1_test_pressure_display}</p>
	</div>

	<div class="pt2_test_pressure">
		<p>{pt2_test_pressure_display}</p>
	</div>
<!--
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

	<div class="pt1_test_pressure">
		<p>{pt1_test_pressure_display}</p>
	</div>

	<div class="pt2_test_pressure">
		<p>{pt2_test_pressure_display}</p>
	</div>

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
	{#if $currentState == "RS_PRELAUNCH"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => confirmStateChange("RSC_GOTO_FILL")}>Go to Fill</button
		>
		<button
			class="btn variant-ghost-error next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}>Go to Abort</button
		>
	{:else if $currentState == "RS_FILL"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => confirmStateChange("RSC_GOTO_PRELAUNCH")}>Go to Pre-Launch</button
		>
		<button
		class="btn variant-filled-warning arm_button"
		style="top: calc(var(--container-width) * 0.47);"
		on:click={() => instantStateChange("RSC_ARM_CONFIRM_1")}>ARM CONFIRM 1</button
		>
		<button
		class="btn variant-filled-warning arm_button"
		style="top: calc(var(--container-width) * 0.5);"
		on:click={() => instantStateChange("RSC_ARM_CONFIRM_2")}>ARM CONFIRM 2</button
		>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => confirmStateChange("RSC_GOTO_ARM")}>Go to Arm</button
		>
		<button
			class="btn variant-ghost-error next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}>Go to Abort</button
		>
	{:else if $currentState == "RS_ARM"}
		<button
		class="btn variant-filled-secondary next-state-btn"
		style="top: calc(var(--container-width) * 0.5);"
		on:click={() => confirmStateChange("RSC_GOTO_FILL")}>Go to Fill</button
		>
		<button
			class="btn variant-filled-warning next-state-btn"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => confirmStateChange("RSC_GOTO_IGNITION")}>Go to Ignition</button
		>
		<button
			class="btn variant-ghost-error next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}>Go to Abort</button
		>
	{:else if $currentState == "RS_IGNITION"}
		<button
			class="btn variant-filled-error next-state-btn"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => handleLaunchSequence()}>LAUNCH</button
		>
		<button
		class="btn variant-filled-secondary next-state-btn"
		style="top: calc(var(--container-width) * 0.5);"
		on:click={() => confirmStateChange("RSC_GOTO_ARM")}>Go to Arm</button
		>
	{:else if $currentState == "RS_ABORT"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => confirmStateChange("RSC_GOTO_PRELAUNCH")}>Go to Pre-Launch</button
		>
		<button
		class="btn variant-filled-secondary next-state-btn"
		style="top: calc(var(--container-width) * 0.5);"
		on:click={() => confirmStateChange("RSC_GOTO_TEST")}>Go to Test</button
		>
	{:else if $currentState == "RS_RECOVERY"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}>Go to Abort</button
		>
	{:else if $currentState == "RS_TEST"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}>Go to Abort</button
		>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => instantStateChange("RSC_TEST_MEV_OPEN")}>Open MEV</button
		>
		<button
		class="btn variant-filled-secondary next-state-btn"
		style="top: calc(var(--container-width) * 0.47);"
		on:click={() => instantStateChange("RSC_MEV_CLOSE")}>Close MEV</button
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
		left: 8%;
		width: 200px;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1600));
	}

	.arm_button {
		position: absolute;
		left: 21%;
		width: 200px;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1600));
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
		top: calc(var(--container-width) * 0.109);
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
		top: calc(var(--container-width) * 0.274);
		left: 50%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.sol1_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.197);
		left: 42.6%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.sol2_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.197);
		left: 54.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.sol3_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.29);
		left: 65.2%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.sol4_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.29);
		left: 72.3%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
	}

	.test_sol_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.433);
		left: 31%;
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
		top: calc(var(--container-width) * 0.274);
		left: 14.9%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc4_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc5_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc6_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc7_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.tc8_temperature {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 97%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc1_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.117);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc2_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc3_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc4_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc5_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.lc6_mass {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 97%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt1_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.117);
		left: 14.7%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt2_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.1882);
		left: 14.7%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt3_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.2743);
		left: 14.9%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt4_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt5_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt6_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt7_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt8_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 97%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt9_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 97%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt10_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.117);
		left: 14.7%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt11_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.1882);
		left: 14.7%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt12_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.2743);
		left: 14.9%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt13_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt14_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 42%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt15_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.188);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt16_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.274);
		left: 69.5%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt1_test_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.41);
		left: 26%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

	.pt2_test_pressure {
		position: absolute;
		top: calc(var(--container-width) * 0.41);
		left: 30.3%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 1500));
		font-size: 14px;
	}

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
	}
</style>