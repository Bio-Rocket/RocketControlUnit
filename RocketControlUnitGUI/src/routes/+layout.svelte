<script lang="ts">
	import '../styles/app.postcss';
	import { ThemeData, ThemeType } from '$lib/theme';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { page } from '$app/stores';
	import {
		AppShell,
		AppRail,
		AppRailAnchor,
		AppBar,
		initializeStores,
		Modal,
		storePopup,
	} from '@skeletonlabs/skeleton';
	import { initTimestamps, } from '$lib/timestamps';
	import { usePocketbase } from '$lib/hooks/usePocketbase';
	import { initStores, currentState, hardware_abort_active } from '$lib/stores';

	const timestamps = initTimestamps();
	const stores = initStores();
	const usePocketbaseHook = usePocketbase(timestamps, stores);
	const {
		downloadAllCSVs,
	} = usePocketbaseHook;

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	$: themeData = new ThemeData(ThemeType.LIGHT);
</script>

<Modal />

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<div class="flex items-center">
						<img
							src={themeData.logoSrc}
							alt="BioRocket Logo"
							class="mr-2"
							style="width: 90px; height: 35px;"
						/>
					</div>
				</div>
			</svelte:fragment>

			<svelte:fragment>
				<h1 class="text-xl">
					Current System State: {$currentState}
				</h1>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<div class="flex flex-col items-end gap-1">
					<div class="text-sm font-semibold">
						<span>Hardware Abort:</span>
						{#if $hardware_abort_active}
							<span class="text-red-500 font-bold animate-pulse ml-1">ACTIVE</span>
						{:else}
							<span class="text-green-500 font-bold ml-1">CLEAR</span>
						{/if}
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							class="btn btn-sm variant-filled-tertiary"
							on:click={() => downloadAllCSVs()}
						>
							Download Logs
						</button>
						<h3 class="text-lg">Cold Flow</h3>
					</div>
				</div>
			</svelte:fragment>

		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<AppRailAnchor hover="bg-primary-hover-token" href="/" selected={$page.url.pathname === '/'}>
				<img src="/icons/rocket.png" class="sideBar-center" alt="Icon" />
			</AppRailAnchor>
		</AppRail>
	</svelte:fragment>

	<slot />

</AppShell>

<style>
	.sideBar-center {
		filter: var(--icon-filter);
		transition: filter 0.15s ease;
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 30%;
		height: width;
	}
</style>
