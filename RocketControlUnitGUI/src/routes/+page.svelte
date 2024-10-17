<script lang="ts">
	import { getModalStore, SlideToggle} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import PocketBase from 'pocketbase';
	import SolTesting from './sol_testing.svelte';

	const PB = new PocketBase('http://192.168.0.69:8090');

	let containerElement: any;

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

	const sol_test_open = writable(undefined);

	const pt1_test_pressure: Writable<string | number | undefined> = writable(undefined);
	const pt2_test_pressure: Writable<string | number | undefined> = writable(undefined);

	$: sol_test_display = $sol_test_open === undefined ? 'N/A' : $sol_test_open ? 'OPEN' : 'CLOSED';

	$: pt1_test_pressure_display = $pt1_test_pressure === undefined ? 'N/A' : Math.round($pt1_test_pressure as number);
	$: pt2_test_pressure_display = $pt2_test_pressure === undefined ? 'N/A' : Math.round($pt2_test_pressure as number);

	let labjackitter = 0;
	let plcitter = 0;

	onMount(async () => {
		PB.collection('LabJack1').subscribe('*', function (e) {
			labjackitter++;
			if (labjackitter % 50 === 0) { 
				pt1_test_pressure.set(e.record.lj1_data[0][0] * 14.5);
				pt2_test_pressure.set(e.record.lj1_data[0][1] * 14.5);
				labjackitter = 0
			}
		});

		PB.collection('Plc').subscribe('*', function (e) {
			if (plcitter % 50 === 0) {
				sol_test_open.set(e.record.plc_data[0]);
				plcitter = 0;
			}
		});
	});

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

</script>

<div class="container">
	<svelte:component this={SolTesting} />

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

	<div class="pt1_test_pressure">
		<p>{pt1_test_pressure_display}</p>
	</div>

	<div class="pt2_test_pressure">
		<p>{pt2_test_pressure_display}</p>
	</div>
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

	.test_sol_slider {
		position: absolute;
		top: calc(var(--container-width) * 0.433);
		left: 31%;
		transform: translate(-50%, -50%) scale(calc(var(--container-width-unitless) / 2000));
		font-size: 16px;
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
</style>