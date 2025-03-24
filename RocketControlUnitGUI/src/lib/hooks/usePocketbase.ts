import PocketBase from 'pocketbase';
import type { Timestamps } from '../timestamps';
import type { Stores } from '../stores';
import { currentState } from '../stores';

export type PocketbaseHook = ReturnType<typeof usePocketbase>;

export const usePocketbase = (timestamps: Timestamps, stores: Stores) => {
	const pocketbase = new PocketBase('http://192.168.0.69:8090');
	// const pocketbase = new PocketBase('http://127.0.0.1:8090/');

	const authenticate = async () => {
		const email = 'ethan.subasic@gmail.com';
		const password = '1234567890'

		if (email && password) {
			try{
				console.log(pocketbase.collection("_superusers"))
				await pocketbase.collection("_superusers").authWithPassword(email, password);
				console.log('Logged in as super user');
			} catch (error) {
				console.error(`Error logging in as super user ${email}: `, error);
				return false;
			}

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
		await pocketbase.collection('StateCommand').create({
			command: state,
		});
	};

	const writeGroundSystemsCommand = async (command: string) => {
		await pocketbase.collection('GroundSystemsCommand').create({
			command: command
		});
	};

	const writeLoadCellCommand = async (target: string, command: string, weight_kg: number) => {
		await pocketbase.collection('LoadCellCommand').create({
			target: target,
			command: command,
			weight: weight_kg
		});
	};

	const subscribeToCollections = () => {
        pocketbase.collection('Plc').subscribe('*', (e) => {
            stores.pbv1_open.set(e.record.PBV1[0]);
			stores.pbv2_open.set(e.record.PBV2[0]);
			stores.pbv3_open.set(e.record.PBV3[0]);
			stores.pbv4_open.set(e.record.PBV4[0]);
			stores.pbv5_open.set(e.record.PBV5[0]);
			stores.pbv6_open.set(e.record.PBV6[0]);
			stores.pbv7_open.set(e.record.PBV7[0]);
			stores.pbv8_open.set(e.record.PBV8[0]);
            stores.pbv9_open.set(e.record.PBV9[0]);
            stores.pbv10_open.set(e.record.PBV10[0]);
            stores.pbv11_open.set(e.record.PBV11[0]);

            stores.sol1_open.set(e.record.SOL1[0]);
            stores.sol2_open.set(e.record.SOL2[0]);
            stores.sol3_open.set(e.record.SOL3[0]);
            stores.sol4_open.set(e.record.SOL4[0]);
            stores.sol5_open.set(e.record.SOL5[0]);
            stores.sol6_open.set(e.record.SOL6[0]);
            stores.sol7_open.set(e.record.SOL7[0]);
            stores.sol8_open.set(e.record.SOL8[0]);
            stores.sol9_open.set(e.record.SOL9[0]);

            stores.heater_on.set(e.record.HEATER[0]);

            stores.pmp3_on.set(e.record.PMP3[0]);

            stores.ign1_on.set(e.record.IGN1[0]);
            stores.ign2_on.set(e.record.IGN2[0]);

            stores.pt1_pressure.set(Math.round(e.record.PT1[0]) * 580);
			stores.pt2_pressure.set(Math.round(e.record.PT2[0]) * 580);
			stores.pt3_pressure.set(Math.round(e.record.PT3[0]) * 580);
			stores.pt4_pressure.set(Math.round(e.record.PT4[0]) * 145);
			stores.pt5_pressure.set(Math.round(e.record.PT5[0]) * 145);
			stores.pt13_pressure.set(Math.round(e.record.PT13[0]) * 14.5);
			stores.pt14_pressure.set(Math.round(e.record.PT14[0]) * 14.5);

			stores.tc1_temperature.set(e.record.TC1[0]);
			stores.tc2_temperature.set(e.record.TC2[0]);
			stores.tc3_temperature.set(e.record.TC3[0]);
			stores.tc4_temperature.set(e.record.TC4[0]);
			stores.tc5_temperature.set(e.record.TC5[0]);
			stores.tc6_temperature.set(e.record.TC6[0]);
			stores.tc7_temperature.set(e.record.TC7[0]);
			stores.tc8_temperature.set(e.record.TC8[0]);
			stores.tc9_temperature.set(e.record.TC9[0]);

			stores.lc1_mass.set(e.record.LC1[0]);
			stores.lc2_mass.set(e.record.LC2[0]);
            stores.lc7_mass.set(e.record.LC7[0]);
		});

		pocketbase.collection('LabJack').subscribe('*', (e) => {
			stores.lc3_mass.set(e.record.LC3[0]);
			stores.lc4_mass.set(e.record.LC4[0]);
			stores.lc5_mass.set(e.record.LC5[0]);
			stores.lc6_mass.set(e.record.LC6[0]);

			stores.pt6_pressure.set(Math.round(e.record.PT6[0][0]) * 580);
			stores.pt7_pressure.set(Math.round(e.record.PT7[0][0]) * 580);
			stores.pt8_pressure.set(Math.round(e.record.PT8[0][0]) * 145);
			stores.pt9_pressure.set(Math.round(e.record.PT9[0][0]) * 145);
			stores.pt10_pressure.set(Math.round(e.record.PT10[0][0]) * 145);
			stores.pt11_pressure.set(Math.round(e.record.PT11[0][0]) * 145);
			stores.pt12_pressure.set(Math.round(e.record.PT12[0][0]) * 145);
		});

		pocketbase.collection('SystemState').subscribe('*', (e) => {
			currentState.set(e.record.system_state);
			timestamps.sys_state = Date.now();
		});
	};

	return {
		authenticate,
		sendHeartbeat,
		writeStateChange,
        writeGroundSystemsCommand,
		writeLoadCellCommand,
		subscribeToCollections
	};
};