import PocketBase from 'pocketbase';
import type { Timestamps } from '../timestamps';
import type { Stores } from '../stores';
import { currentState, operationConfig } from '../stores';
//import { get } from 'svelte/store';

export type PocketbaseHook = ReturnType<typeof usePocketbase>;

export const usePocketbase = (timestamps: Timestamps, stores: Stores) => {
	//const pocketbase = new PocketBase('http://192.168.0.69:8090');
	const pocketbase = new PocketBase('http://127.0.0.1:8090');

	const authenticate = async () => {
		const email = import.meta.env.VITE_EMAIL;
		const password = import.meta.env.VITE_PASSWORD;

		if (email && password) {
			pocketbase.authStore.clear();
			await pocketbase.admins.authWithPassword(email, password);

			return true;
		}

		return false;
	};

	const sendHeartbeat = async () => {
		await pocketbase.collection('HeartbeatMessage').create({
			message: 'heartbeat'
		});
	};

	const writeStateChange = async (state: string) => {
		await pocketbase.collection('StateCommands').create({
			command: state,
            config : operationConfig
		});
	};

	const writeGroundSystemsCommand = async (command: string) => {
		await pocketbase.collection('GroundSystemsCommand').create({
			command
		});
	};

    const writeRocketCommand = async (target: string, command: string) => {
		await pocketbase.collection('RocketCommands').create({
            target: target,
			command
		});
	};

	const writeLoadCellCommand = async (target: string, command: string, weight_kg: number) => {
		await pocketbase.collection('LoadCellCommands').create({
			target: target,
			command: command,
			weight: weight_kg
		});
	};

	const subscribeToCollections = () => {
        pocketbase.collection('Plc').subscribe('*', (e) => {
            stores.pbv1_open.set(e.record.PBV1);
			stores.pbv2_open.set(e.record.PBV2);
			stores.pbv3_open.set(e.record.PBV3);
			stores.pbv4_open.set(e.record.PBV4);
			stores.pbv5_open.set(e.record.PBV5);
			stores.pbv6_open.set(e.record.PBV6);
			stores.pbv7_open.set(e.record.PBV7);
			stores.pbv8_open.set(e.record.PBV8);
            stores.pbv9_open.set(e.record.PBV9);
            stores.pbv10_open.set(e.record.PBV10);
            stores.pbv11_open.set(e.record.PBV11);
            stores.sol1_open.set(e.record.SOL1);
            stores.sol2_open.set(e.record.SOL2);
            stores.sol3_open.set(e.record.SOL3);
            stores.sol4_open.set(e.record.SOL4);
            stores.sol5_open.set(e.record.SOL5);
            stores.sol6_open.set(e.record.SOL6);
            stores.sol7_open.set(e.record.SOL7);
            stores.sol8_open.set(e.record.SOL8);
            stores.sol9_open.set(e.record.SOL9);
            stores.heater_on.set(e.record.HEATER);
            stores.pmp3_on.set(e.record.PMP3);
            stores.ign1_on.set(e.record.IGN1);
            stores.ign2_on.set(e.record.IGN2);
            stores.pt1_pressure.set(Math.round(e.record.PT1) * 580);
			stores.pt2_pressure.set(Math.round(e.record.PT2) * 580);
			stores.pt3_pressure.set(Math.round(e.record.PT3) * 580);
			stores.pt4_pressure.set(Math.round(e.record.PT4) * 145);
			stores.pt5_pressure.set(Math.round(e.record.PT5) * 145);
			stores.pt13_pressure.set(Math.round(e.record.PT15) * 14.5);
			stores.pt14_pressure.set(Math.round(e.record.PT16) * 14.5);
			stores.tc1_temperature.set(e.record.TC1);
			stores.tc2_temperature.set(e.record.TC2);
			stores.tc3_temperature.set(e.record.TC3);
			stores.tc4_temperature.set(e.record.TC4);
			stores.tc5_temperature.set(e.record.TC5);
			stores.tc6_temperature.set(e.record.TC6);
			stores.tc7_temperature.set(e.record.TC7);
			stores.tc8_temperature.set(e.record.TC8);
			stores.tc9_temperature.set(e.record.TC9);
			stores.lc1_mass.set(e.record.LC1);
			stores.lc2_mass.set(e.record.LC2);
            stores.lc7_mass.set(e.record.LC7);
		});

  
		// pocketbase.collection('LabJack').subscribe('*', (e) => {
		// 	stores.lc3_mass.set(e.record.LC3[0]);
		// 	stores.lc4_mass.set(e.record.LC4[0]);
		// 	stores.lc5_mass.set(e.record.LC5[0]);
		// 	stores.lc6_mass.set(e.record.LC6[0]);
		// 	stores.pt6_pressure.set(Math.round(e.record.PT6[0]) * 580);
		// 	stores.pt7_pressure.set(Math.round(e.record.PT7[0]) * 580);
		// 	stores.pt8_pressure.set(Math.round(e.record.PT8[0]) * 145);
		// 	stores.pt9_pressure.set(Math.round(e.record.PT9[0]) * 145);
		// 	stores.pt10_pressure.set(Math.round(e.record.PT10[0]) * 145);
		// 	stores.pt11_pressure.set(Math.round(e.record.PT11[0]) * 145);
		// 	stores.pt12_pressure.set(Math.round(e.record.PT12[0]) * 145);
		// });
     

		// // Subscribe to changes in the 'SystemState' collection
		// pocketbase.collection('SystemState').subscribe('*', (e) => {
		// 	stores.system_state.set(e.record.sys_state);
		// 	currentState.set(e.record.rocket_state);
		// 	timestamps.sys_state = Date.now();
		// });

		// // Subscribe to changes in the 'HeartbeatTelemetry' collection
		// pocketbase.collection('HeartbeatTelemetry').subscribe('*', (e) => {
		// 	stores.timer_state.set(e.record.timer_state);
		// 	stores.timer_period.set(e.record.timer_period);
		// 	stores.timer_remaining.set(e.record.timer_remaining);

		// 	timestamps.heartbeat = Date.now();
		// });
	};

	return {
		authenticate,
		sendHeartbeat,
		writeStateChange,
        writeGroundSystemsCommand,
		writeRocketCommand,
		writeLoadCellCommand,
		subscribeToCollections
	};
};