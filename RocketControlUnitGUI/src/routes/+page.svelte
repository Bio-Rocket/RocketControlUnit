<script lang="ts">
	import "../styles/display.postcss";
	import Diagram from '$lib/components/Diagram.svelte';
	import { initTimestamps, type Timestamps } from '$lib/timestamps';
	import { usePocketbase } from '$lib/hooks/usePocketbase';
	import { initStores, auth, currentState } from '$lib/stores';
	import { useInteraction } from '$lib/hooks/useInteraction';
	import { onMount } from 'svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { get } from "svelte/store";

	const timestamps = initTimestamps();
	const stores = initStores();
	const usePocketbaseHook = usePocketbase(timestamps, stores);
	const useInteractionHook = useInteraction(usePocketbaseHook);

	const {
		authenticate,
		sendHeartbeat,
		subscribeToCollections,
		writeStateChange,
		writeGroundSystemsCommand,
		writeRocketCommand,
		writeLoadCellCommand
	} = usePocketbaseHook;

	const {
		confirmStateChange,
		instantStateChange,
		resumeConfirmRemoveWeight
	} = useInteractionHook;

	// Destructor stores for later use
	const {
        pbv1_open,
        pbv2_open,
        pbv3_open,
        pbv4_open,
		pbv5_open,
		pbv6_open,
		pbv7_open,
		pbv8_open,
		pbv9_open,
		pbv10_open,
		pbv11_open,
		sol1_open,
		sol2_open,
		sol3_open,
		sol4_open,
        sol5_open,
        sol6_open,
        sol7_open,
        sol8_open,
		sol9_open,
		sol10_open,
		sol11_open,
		sol12_open,
		sol13_open,
		sol14_open,
		heater_on,
		pmp3_on,
		ign1_on,
		ign2_on,
		pt1_pressure,
		pt2_pressure,
		pt3_pressure,
		pt4_pressure,
		pt5_pressure,
		pt6_pressure,
		pt7_pressure,
		pt8_pressure,
		pt9_pressure,
		pt10_pressure,
		pt11_pressure,
		pt12_pressure,
		pt13_pressure,
		pt14_pressure,
		pt15_pressure,
		pt16_pressure,
		pt17_pressure,
		pt18_pressure,
		pt19_pressure,
		tc1_temperature,
		tc2_temperature,
		tc3_temperature,
		tc4_temperature,
		tc5_temperature,
		tc6_temperature,
		tc7_temperature,
		tc8_temperature,
		tc9_temperature,
		tc10_temperature,
		tc11_temperature,
		tc12_temperature,
		lc1_mass,
		lc2_mass,
		lc3_mass,
		lc4_mass,
		lc5_mass,
		lc6_mass,
		lc7_mass,
		system_state,
		timer_state,
		timer_period,
		timer_remaining,
	} = stores;

	const StateArray = {
        Prefire_Valve_State: {
            PBV1: false,
            PBV2: false,
            PBV3: false,
            PBV4: false,
            PBV5: false,
            PBV6: false,
            PBV7: false,
            PBV8: false,
			SOL12: false,
            SOL13: false,
            PUMP3: false,
        },

        Ignition_Valve_State: {
            PBV1: false,
            PBV2: true,
            PBV3: false,
            PBV4: true,
			PBV5: false,
			PBV6: false,
            PBV7: true,
            PBV8: true,
			SOL12: false,
            SOL13: false,
            PUMP3: false,
        }
    };

	onMount(() => {
		let heartbeatInterval: NodeJS.Timeout;

		// Handle pocketbase authentication
		const handleAuth = async () => {
			$auth = await authenticate();

			if ($auth === true) {
				heartbeatInterval = setInterval(async () => {
					await sendHeartbeat();
				}, 5000); // 5000 milliseconds = 5 seconds
			}
		}

		handleAuth();

		// Subscribe to pocket base events
		subscribeToCollections();

		// Handle displaying outdated data
		let containerElement = document.querySelector('.container') as HTMLElement;

		let timestampInterval = setInterval(() => {
			for (let variable in timestamps) {
				let elements = document.getElementsByClassName(variable);
				if (!elements.length) continue;

				for(let i = 0; i < elements.length; i++) {
					let element = elements[i];

					if (Date.now() - timestamps[variable as keyof Timestamps] > 5000) {
						element.classList.add('outdated');
					} else {
						element.classList.remove('outdated');
					}
				}
			}
		}, 1000);

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

		// Return a cleanup function
		return () => {
			clearInterval(heartbeatInterval); // Stop the interval when the component is destroyed
			clearInterval(timestampInterval);

			window.removeEventListener('resize', handleResize);
		};
	});

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

	$: system_state_display = $system_state === undefined ? 'N/A' : $system_state.replace('SYS_', '');

	$: timer_state_display = $timer_state === undefined ? 'N/A' : $timer_state;
	$: timer_period_display = $timer_period === undefined ? 'N/A' : ($timer_period / 1000).toFixed(0); // Convert to seconds
	$: timer_remaining_display = $timer_remaining === undefined ? 'N/A' : ($timer_remaining / 1000).toFixed(0); // Convert to seconds

	$: relayStatusOutdated = Date.now() - timestamps.relay_status > 5000;
	$: combustionControlStatusOutdated = Date.now() - timestamps.combustion_control_status > 5000;
	$: rcuTempOutdated = Date.now() - timestamps.rcu_temp > 5000;
	$: batteryOutdated = Date.now() - timestamps.battery > 5000;
	$: launchRailLoadCellOutdated = Date.now() - timestamps.launch_rail_load_cell > 5000;
	$: nosLoadCellOutdated = Date.now() - timestamps.nos_load_cell > 5000;
	$: pbbPressureOutdated = Date.now() - timestamps.pbb_pressure > 5000;
	$: pbbTemperatureOutdated = Date.now() - timestamps.pbb_temperature > 5000;
	$: rcuPressureOutdated = Date.now() - timestamps.rcu_pressure > 5000;
	$: sobTemperatureOutdated = Date.now() - timestamps.sob_temperature > 5000;
	$: sysStateOutdated = Date.now() - timestamps.sys_state > 5000;
	$: heartbeatOutdated = Date.now() - timestamps.heartbeat > 5000;

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
		writeGroundSystemsCommand(command);
	}

	let wasLiveAtAnyPoint = false;

	async function pollIgnitors() {
		if (ign1_display === 'LIVE' || ign2_display === 'LIVE') {
			wasLiveAtAnyPoint = true;
		}
	}

	const handleLaunchSequence = async () => {
		await writeGroundSystemsCommand('RC_IGNITE_PAD_BOX1');
		await writeGroundSystemsCommand('RC_IGNITE_PAD_BOX2');

		const pollInterval = setInterval(pollIgnitors, 100);
		await new Promise(resolve => setTimeout(resolve, 3500));

		clearInterval(pollInterval);

		if (wasLiveAtAnyPoint) {
			for (let i = 0; i < 3; i++) {
				await writeStateChange('RSC_IGNITION_TO_LAUNCH');
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
	<Diagram />

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
			on:click={(e) => handlePlcSliderChange(e, 'SOL12_OPEN', 'SOL12_CLOSE')}
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
			on:click={(e) => handlePlcSliderChange(e, 'SOL13_OPEN', 'SOL13_CLOSE')}
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
			on:click={() => instantStateChange("GOTO_POSTFIRE")}>Soft Abort</button
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
			on:click={() => instantStateChange("GOTO_POSTFIRE")}>Soft Abort</button
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