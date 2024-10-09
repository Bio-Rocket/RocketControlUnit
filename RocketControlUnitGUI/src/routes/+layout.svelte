<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppRail,
		AppRailAnchor,
		AppBar,
		initializeStores,
		LightSwitch,
		Modal,
		storePopup,
		modeCurrent
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	import { currentState } from '../store';
	import { page } from '$app/stores';

	initializeStores();

	$: logoSrc = $modeCurrent ? '/biorocketfull.svg' : '/soar_logo_dark.svg';
	$: homeIcon = $modeCurrent ? '/rocket-light.png' : '/rocket-dark.png';
	$: aboutIcon = $modeCurrent ? '/info-light.png' : '/info-dark.png';
	$: cameraIcon = $modeCurrent ? '/camera-light.png' : '/camera-dark.png';
	$: statsIcon = $modeCurrent ? '/stats-light.png' : '/stats-dark.png';

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
							src={logoSrc}
							alt="SOAR Logo"
							class="mr-2"
							style="width: 90px; height: 35px;"
						/>
					</div>
				</div>
			</svelte:fragment>

			<svelte:fragment>
				<h1 class="text-xl">Current Rocket State: {$currentState}</h1>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch class="ml-auto" />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<AppRailAnchor hover="bg-primary-hover-token" href="/" selected={$page.url.pathname === '/'}><img src={homeIcon} class="sideBar-center" 
			alt="Icon" /></AppRailAnchor>
			
			<AppRailAnchor href="/data" selected={$page.url.pathname === "/data"}><img src={statsIcon} class="sideBar-center" 
			alt="Icon" /></AppRailAnchor>
			
			<AppRailAnchor href="/live-feed" selected={$page.url.pathname === "/live-feed"}><img src={cameraIcon} class="sideBar-center" 
			alt="Icon" /></AppRailAnchor>
			
			<AppRailAnchor href="/about" selected={$page.url.pathname === "/about"}><img src={aboutIcon} class="sideBar-center" 
			alt="Icon" /></AppRailAnchor>
		</AppRail>
	</svelte:fragment>
	
	<slot />

</AppShell>

<style>
	.sideBar-center {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 30%;
		height: width;
	}
	
</style>