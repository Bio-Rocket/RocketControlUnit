<script lang="ts">
	import "../styles/static-fire.postcss";
	import Diagram from '$lib/components/StaticFire.svelte';
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
		writeGroundSystemsCommand,
		exportDataToFile
	} = usePocketbaseHook;
	const {
		confirmStateChange,
		instantStateChange
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
		tc10_temperature,
		tc11_temperature,
		tc12_temperature,
		lc1_mass,
		lc2_mass,
		lc3_mass,
		lc4_mass,
		lc5_mass,
		lc6_mass,
		lc7_mass
	} = stores;

	const StateArray = {
        Abort_Valve_State: {
            PBV1: false,
            PBV2: false,
            PBV3: false,
            PBV4: false,
            PBV5: false,
            PBV6: false,
            PBV7: false,
            PBV8: false,
			PBV9: false,
			PBV10: false,
			PBV11: false,
			SOL1: false,
			SOL2: false,
			SOL3: false,
			SOL4: false,
			SOL5: false,
			IGN1: false,
			IGN2: false,
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
	$: pbv5_display = $pbv5_open === undefined ? 'N/A' : $pbv5_open ? 'CLOSED' : 'OPEN';
	$: pbv6_display = $pbv6_open === undefined ? 'N/A' : $pbv6_open ? 'OPEN' : 'CLOSED';
	$: pbv7_display = $pbv7_open === undefined ? 'N/A' : $pbv7_open ? 'OPEN' : 'CLOSED';
	$: pbv8_display = $pbv8_open === undefined ? 'N/A' : $pbv8_open ? 'OPEN' : 'CLOSED';
	$: pbv9_display = $pbv9_open === undefined ? 'N/A' : $pbv9_open ? 'CLOSED' : 'OPEN';
	$: pbv10_display = $pbv10_open === undefined ? 'N/A' : $pbv10_open ? 'OPEN' : 'CLOSED';
	$: pbv11_display = $pbv11_open === undefined ? 'N/A' : $pbv11_open ? 'OPEN' : 'CLOSED';
	$: sol1_display = $sol1_open === undefined ? 'N/A' : $sol1_open ? 'OPEN' : 'CLOSED';
	$: sol2_display = $sol2_open === undefined ? 'N/A' : $sol2_open ? 'OPEN' : 'CLOSED';
	$: sol3_display = $sol3_open === undefined ? 'N/A' : $sol3_open ? 'OPEN' : 'CLOSED';
	$: sol4_display = $sol4_open === undefined ? 'N/A' : $sol4_open ? 'OPEN' : 'CLOSED';
	$: sol5_display = $sol5_open === undefined ? 'N/A' : $sol5_open ? 'OPEN' : 'CLOSED';
	$: ign1_display = $ign1_on === undefined ? 'N/A' : $ign1_on ? 'LIVE' : 'DEAD';
	$: ign2_display = $ign2_on === undefined ? 'N/A' : $ign2_on ? 'LIVE' : 'DEAD';
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
	$: pt18_pressure_display = $pt18_pressure === undefined ? 'N/A' : $pt18_pressure;
	$: pt19_pressure_display = $pt19_pressure === undefined ? 'N/A' : $pt19_pressure;
	$: tc1_display = $tc1_temperature === undefined ? 'N/A' : $tc1_temperature;
	$: tc2_display = $tc2_temperature === undefined ? 'N/A' : $tc2_temperature;
	$: tc3_display = $tc3_temperature === undefined ? 'N/A' : $tc3_temperature;
	$: tc4_display = $tc4_temperature === undefined ? 'N/A' : $tc4_temperature;
	$: tc5_display = $tc5_temperature === undefined ? 'N/A' : $tc5_temperature;
	$: tc6_display = $tc6_temperature === undefined ? 'N/A' : $tc6_temperature;
	$: tc10_display = $tc10_temperature === undefined ? 'N/A' : $tc10_temperature;
	$: tc11_display = $tc11_temperature === undefined ? 'N/A' : $tc11_temperature;
	$: tc12_display = $tc12_temperature === undefined ? 'N/A' : $tc12_temperature;
	$: lc1_mass_display = $lc1_mass === undefined ? 'N/A' : Number($lc1_mass).toFixed(2);
	$: lc2_mass_display = $lc2_mass === undefined ? 'N/A' : Number($lc2_mass).toFixed(2);
	$: lc3_mass_display = $lc3_mass === undefined ? 'N/A' : Number($lc3_mass).toFixed(2);
	$: lc4_mass_display = $lc4_mass === undefined ? 'N/A' : Number($lc4_mass).toFixed(2);
	$: lc5_mass_display = $lc5_mass === undefined ? 'N/A' : Number($lc5_mass).toFixed(2);
	$: lc6_mass_display = $lc6_mass === undefined ? 'N/A' : Number($lc6_mass).toFixed(2);
	$: lc7_mass_display = $lc7_mass === undefined ? 'N/A' : Number($lc7_mass).toFixed(2);


	async function handleSliderChange(
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

	// function checkStateAndChangeIgnition() {
	// 	const currentState = {
	// 		PBV1: get(pbv1_open),
	// 		PBV2: get(pbv2_open),
	// 		PBV3: get(pbv3_open),
	// 		PBV4: get(pbv4_open),
	// 		PBV5: get(pbv5_open),
	// 		PBV6: get(pbv6_open),
	// 		PBV7: get(pbv7_open),
	// 		PBV8: get(pbv8_open),
	// 	};
	// 	const ignitionState = StateArray.Ignition_Valve_State;
	// 	const isEqual = Object.keys(ignitionState).every(key => {
	// 	const currentValue = currentState[key as keyof typeof currentState];
	// 	const ignitionValue = ignitionState[key as keyof typeof ignitionState];
	// 	return currentValue === ignitionValue || (currentValue === undefined && ignitionValue === undefined);
	// 	});
	// 	if (isEqual) {
	// 		instantStateChange("GOTO_IGNITION");
	// 	} else {
	// 		confirmStateChange("GOTO_IGNITION");
	// 	}
  	// }

</script>


<div class="container">
	<Diagram />

	<div class="static_pbv1_slider">
		<SlideToggle
			name="static_pbv1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv1_open}
			on:click={(e) => handleSliderChange(e, 'PBV1_OPEN', 'PBV1_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv1_display}</SlideToggle
		>
	</div>

	<div class="static_pbv2_slider">
		<SlideToggle
			name="static_pbv2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv2_open}
			on:click={(e) => handleSliderChange(e, 'PBV2_OPEN', 'PBV2_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv2_display}</SlideToggle
		>
	</div>

	<div class="static_pbv3_slider">
		<SlideToggle
			name="static_pbv3_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv3_open}
			on:click={(e) => handleSliderChange(e, 'PBV3_OPEN', 'PBV3_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv3_display}</SlideToggle
		>
	</div>

	<div class="static_pbv4_slider">
		<SlideToggle
			name="static_pbv4_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv4_open}
			on:click={(e) => handleSliderChange(e, 'PBV4_OPEN', 'PBV4_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv4_display}</SlideToggle
		>
	</div>

	<div class="static_pbv5_slider">
		<SlideToggle
			name="static_pbv5_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv5_open}
			on:click={(e) => handleSliderChange(e, 'PBV5_OPEN', 'PBV5_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv5_display}</SlideToggle
		>
	</div>

	<div class="static_pbv6_slider">
		<SlideToggle
			name="static_pbv6_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv6_open}
			on:click={(e) => handleSliderChange(e, 'PBV6_OPEN', 'PBV6_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv6_display}</SlideToggle
		>
	</div>

	<div class="static_pbv7_slider">
		<SlideToggle
			name="static_pbv7_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv7_open}
			on:click={(e) => handleSliderChange(e, 'PBV7_OPEN', 'PBV7_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv7_display}</SlideToggle
		>
	</div>

	<div class="static_pbv8_slider">
		<SlideToggle
			name="static_pbv8_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv8_open}
			on:click={(e) => handleSliderChange(e, 'PBV8_OPEN', 'PBV8_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv8_display}</SlideToggle
		>
	</div>

	<div class="static_pbv9_slider">
		<SlideToggle
			name="static_pbv9_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv9_open}
			on:click={(e) => handleSliderChange(e, 'PBV9_OPEN', 'PBV9_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv9_display}</SlideToggle
		>
	</div>

	<div class="static_pbv10_slider">
		<SlideToggle
			name="static_pbv10_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv10_open}
			on:click={(e) => handleSliderChange(e, 'PBV10_OPEN', 'PBV10_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv10_display}</SlideToggle
		>
	</div>

	<div class="static_pbv11_slider">
		<SlideToggle
			name="static_pbv11_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pbv11_open}
			on:click={(e) => handleSliderChange(e, 'PBV11_OPEN', 'PBV11_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{pbv11_display}</SlideToggle
		>
	</div>

	<div class="static_sol1_slider">
		<SlideToggle
			name="static_sol1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol1_open}
			on:click={(e) => handleSliderChange(e, 'SOL1_OPEN', 'SOL1_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{sol1_display}</SlideToggle
		>
	</div>

	<div class="static_sol2_slider">
		<SlideToggle
			name="static_sol2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol2_open}
			on:click={(e) => handleSliderChange(e, 'SOL2_OPEN', 'SOL2_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{sol2_display}</SlideToggle
		>
	</div>

	<div class="static_sol3_slider">
		<SlideToggle
			name="static_sol3_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol3_open}
			on:click={(e) => handleSliderChange(e, 'SOL3_OPEN', 'SOL3_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{sol3_display}</SlideToggle
		>
	</div>

	<div class="static_sol4_slider">
		<SlideToggle
			name="static_sol4_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol4_open}
			on:click={(e) => handleSliderChange(e, 'SOL4_OPEN', 'SOL4_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{sol4_display}</SlideToggle
		>
	</div>

	<div class="static_sol5_slider">
		<SlideToggle
			name="static_sol5_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol5_open}
			on:click={(e) => handleSliderChange(e, 'SOL5_OPEN', 'SOL5_CLOSE')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{sol5_display}</SlideToggle
		>
	</div>

	<div class="static_ign1_slider">
		<SlideToggle
			name="static_ign1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$ign1_on}
			on:click={(e) => handleSliderChange(e, 'IGN1_ON', 'IGN1_OFF')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{ign1_display}</SlideToggle
		>
	</div>

	<div class="static_ign2_slider">
		<SlideToggle
			name="static_ign2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$ign2_on}
			on:click={(e) => handleSliderChange(e, 'IGN2_ON', 'IGN2_OFF')}
			disabled={["IGNITION", "FIRE", "ABORT"].includes($currentState)}
		>
			{ign2_display}</SlideToggle
		>
	</div>

	<div class="static_tc1_temperature">
		<p>{tc1_display}</p>
	</div>

	<div class="static_tc2_temperature">
		<p>{tc2_display}</p>
	</div>

	<div class="static_tc3_temperature">
		<p>{tc3_display}</p>
	</div>

	<div class="static_tc4_temperature">
		<p>{tc4_display}</p>
	</div>

	<div class="static_tc5_temperature">
		<p>{tc5_display}</p>
	</div>

	<div class="static_tc6_temperature">
		<p>{tc6_display}</p>
	</div>

	<div class="static_tc10_temperature">
		<p>{tc10_display}</p>
	</div>

	<div class="static_tc11_temperature">
		<p>{tc11_display}</p>
	</div>

	<div class="static_tc12_temperature">
		<p>{tc12_display}</p>
	</div>

	<div class="static_lc1_mass">
		<p>{lc1_mass_display}</p>
	</div>

	<div class="static_lc2_mass">
		<p>{lc2_mass_display}</p>
	</div>

	<div class="static_lc3_mass">
		<p>{lc3_mass_display}</p>
	</div>

	<div class="static_lc4_mass">
		<p>{lc4_mass_display}</p>
	</div>

	<div class="static_lc5_mass">
		<p>{lc5_mass_display}</p>
	</div>

	<div class="static_lc6_mass">
		<p>{lc6_mass_display}</p>
	</div>

	<div class="static_lc7_mass">
		<p>{lc7_mass_display}</p>
	</div>

	<div class="static_pt1_pressure">
		<p>{pt1_pressure_display}</p>
	</div>

	<div class="static_pt2_pressure">
		<p>{pt2_pressure_display}</p>
	</div>

	<div class="static_pt3_pressure">
		<p>{pt3_pressure_display}</p>
	</div>

	<div class="static_pt4_pressure">
		<p>{pt4_pressure_display}</p>
	</div>

	<div class="static_pt5_pressure">
		<p>{pt5_pressure_display}</p>
	</div>

	<div class="static_pt6_pressure">
		<p>{pt6_pressure_display}</p>
	</div>

	<div class="static_pt7_pressure">
		<p>{pt7_pressure_display}</p>
	</div>

	<div class="static_pt8_pressure">
		<p>{pt8_pressure_display}</p>
	</div>

	<div class="static_pt9_pressure">
		<p>{pt9_pressure_display}</p>
	</div>

	<div class="static_pt10_pressure">
		<p>{pt10_pressure_display}</p>
	</div>

	<div class="static_pt11_pressure">
		<p>{pt11_pressure_display}</p>
	</div>

	<div class="static_pt12_pressure">
		<p>{pt12_pressure_display}</p>
	</div>

	<div class="static_pt13_pressure">
		<p>{pt13_pressure_display}</p>
	</div>

	<div class="static_pt14_pressure">
		<p>{pt14_pressure_display}</p>
	</div>

	<div class="static_pt15_pressure">
		<p>{pt15_pressure_display}</p>
	</div>

	<div class="static_pt16_pressure">
		<p>{pt16_pressure_display}</p>
	</div>

	<div class="static_pt17_pressure">
		<p>{pt17_pressure_display}</p>
	</div>

	<div class="static_pt18_pressure">
		<p>{pt18_pressure_display}</p>
	</div>

	<div class="static_pt19_pressure">
		<p>{pt19_pressure_display}</p>
	</div>

	<!-- Render different buttons based on the current state -->
	<div>
		{#if $currentState == "ABORT"}
			<button
				class="btn variant-filled-primary next-state-btn"
				style="left: 12%"
				on:click={() => instantStateChange("GOTO_FILL")}>Go to Fill</button
			>
			<button
				class="btn variant-filled-secondary next-state-btn"
				style="left: 1%"
				on:click={() => instantStateChange("GOTO_TEST")}>Go to Test</button
			>
		{:else if $currentState == "FILL"}
			<button
				class="btn variant-filled-secondary next-state-btn"
				style="left: 1%"
				on:click={() => instantStateChange("GOTO_ABORT")}>Go to Abort</button
			>
			<button
				class="btn variant-filled-warning next-state-btn"
				style="left: 12%"
				on:click={() => confirmStateChange("GOTO_IGNITION")}>Go to Ignition</button
			>
		{:else if $currentState == "IGNITION"}
			<button
				class="btn variant-filled-danger next-state-btn fire-btn"
				style="left:23%"
				on:click={() => instantStateChange("GOTO_FIRE")}>FIRE</button
			>
			<button
				class="btn variant-filled-primary next-state-btn"
				style="left: 12%"
				on:click={() => instantStateChange("GOTO_FILL")}>FILL</button
			>
			<button
				class="btn variant-filled-secondary next-state-btn"
				style="left: 1%"
				on:click={() => instantStateChange("GOTO_ABORT")}>ABORT</button
			>
		{:else if $currentState == "FIRE"}

			<button
				class="btn variant-filled-secondary next-state-btn"
				style="left: 1%"
				on:click={() => instantStateChange("GOTO_ABORT")}>Go to Abort</button
			>
			<button
				class="btn variant-filled-warning next-state-btn"
				style="left: 12%"
				on:click={() => instantStateChange("GOTO_POSTFIRE")}>Go to Post Fire</button
			>
		{:else if $currentState == "POST_FIRE"}

			<button
				class="btn variant-filled-secondary next-state-btn"
				style="left: 1%"
				on:click={() => instantStateChange("GOTO_ABORT")}>Go to Abort</button
			>
			<button
				class="btn variant-filled-primary next-state-btn"
				style="left: 12%"
				on:click={() => instantStateChange("GOTO_FILL")}>Go to Fill</button
			>
		{:else if $currentState == "TEST"}
			<button
			class="btn variant-filled-secondary next-state-btn"
			style="left: 1%"
			on:click={() => instantStateChange("GOTO_ABORT")}>Go to Abort</button
			>
		{/if}
	</div>
<!--
	<div style="position: absolute; right: 1%; top: 1%;">
		<button
			class="btn variant-filled-success"
			on:click={() => exportDataToFile()}
		>
			Download Data
		</button>
	</div> -->

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
</style>