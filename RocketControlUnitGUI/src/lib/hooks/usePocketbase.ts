import PocketBase from 'pocketbase';
import type { Timestamps } from '../timestamps';
import type { Stores } from '../stores';
import { currentState, hardware_abort_active } from '../stores';

export type PocketbaseHook = ReturnType<typeof usePocketbase>;

export const usePocketbase = (timestamps: Timestamps, stores: Stores) => {
	const pocketbase = new PocketBase('http://192.168.8.68:8090');
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

	const writeLoadCellTares = async (lc1: number, lc2: number, lc3: number, lc4: number, lc5: number, lc6: number, lc7: number) => {
		await pocketbase.collection('LoadCellTareValues').create({
			LC1: lc1,
			LC2: lc2,
			LC3: lc3,
			LC4: lc4,
			LC5: lc5,
			LC6: lc6,
			LC7: lc7
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

            stores.ign1_on.set(e.record.IGN1[0]);
            stores.ign2_on.set(e.record.IGN2[0]);

            stores.pt1_pressure.set(Math.round(e.record.PT1[0]*14.5));
			stores.pt2_pressure.set(Math.round(e.record.PT2[0]*580));
			stores.pt3_pressure.set(Math.round(e.record.PT3[0]*580));
			stores.pt4_pressure.set(Math.round(e.record.PT4[0]*145));
			stores.pt5_pressure.set(Math.round(e.record.PT5[0]*145));

			stores.tc1_temperature.set(e.record.TC1[0]);
			stores.tc2_temperature.set(e.record.TC2[0]);
			stores.tc3_temperature.set(e.record.TC3[0]);
			stores.tc4_temperature.set(e.record.TC4[0]);
			stores.tc5_temperature.set(e.record.TC5[0]);
			stores.tc6_temperature.set(e.record.TC6[0]);

			// stores.lc1_mass.set(e.record.LC1[0]);
			// stores.lc2_mass.set(e.record.LC2[0]);
			stores.lc1_mass.set("Nan");
			stores.lc2_mass.set("Nan");

            stores.lc7_mass.set(e.record.LC7[0]);
		});

		pocketbase.collection('LabJack').subscribe('*', (e) => {
			stores.lc3_mass.set(e.record.LC3[0]);
			stores.lc4_mass.set(e.record.LC4[0]);
			stores.lc5_mass.set(e.record.LC5[0]);
			stores.lc6_mass.set(e.record.LC6[0]);

			stores.pt6_pressure.set(Math.round(e.record.PT6[0] * 145));
			stores.pt7_pressure.set(Math.round(e.record.PT7[0] * 145));
			stores.pt8_pressure.set(Math.round(e.record.PT8[0] * 145));
			stores.pt9_pressure.set(Math.round(e.record.PT9[0] * 580));
			stores.pt10_pressure.set(Math.round(e.record.PT10[0] * 580));
			stores.pt11_pressure.set(Math.round(e.record.PT11[0] * 145));
			stores.pt12_pressure.set(Math.round(e.record.PT12[0] * 145));
			stores.pt13_pressure.set(Math.round(e.record.PT13[0]* 145));
			stores.pt14_pressure.set(Math.round(e.record.PT14[0]* 145));
		});

		pocketbase.collection('SystemState').subscribe('*', (e) => {
			currentState.set(e.record.system_state);
			const v = e.record?.hardware_abort;
			hardware_abort_active.set(v === true || v === 1 || v === 'true');
			timestamps.sys_state = Date.now();
		});

		pocketbase.collection('LoadCellTareValues').subscribe('*', (e) => {
			stores.lc1_tare.set(e.record.LC1);
			stores.lc2_tare.set(e.record.LC2);
			stores.lc3_tare.set(e.record.LC3);
			stores.lc4_tare.set(e.record.LC4);
			stores.lc5_tare.set(e.record.LC5);
			stores.lc6_tare.set(e.record.LC6);
			stores.lc7_tare.set(e.record.LC7);
		});

		// Fetch the most recent entry and set the currentState
		(async () => {
			try {
				const latestEntry = await pocketbase.collection('SystemState').getList(1, 1, { sort: '-created' });
				if (latestEntry.items.length > 0) {
					currentState.set(latestEntry.items[0].system_state);
				}
			} catch (error) {
				console.error('Error fetching the most recent SystemState entry:', error);
			}
		})();

		// Fetch the most recent entry and set the LoadCellTare values
		(async () => {
			try {
				const latestTareEntry = await pocketbase.collection('LoadCellTareValues').getList(1, 1, { sort: '-created' });
				if (latestTareEntry.items.length > 0) {
					const tareValues = latestTareEntry.items[0];
					stores.lc1_tare.set(tareValues.LC1);
					stores.lc2_tare.set(tareValues.LC2);
					stores.lc3_tare.set(tareValues.LC3);
					stores.lc4_tare.set(tareValues.LC4);
					stores.lc5_tare.set(tareValues.LC5);
					stores.lc6_tare.set(tareValues.LC6);
					stores.lc7_tare.set(tareValues.LC7);
				}
			} catch (error) {
				console.error('Error fetching the most recent LoadCellTareValues entry:', error);
			}
		})();
	};

	return {
		authenticate,
		sendHeartbeat,
		writeStateChange,
        writeGroundSystemsCommand,
		writeLoadCellTares,
		subscribeToCollections
	};
};