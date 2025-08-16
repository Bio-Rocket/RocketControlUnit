import PocketBase from 'pocketbase';
import type { Timestamps } from '../timestamps';
import { get } from 'svelte/store';
import type { Stores } from '../stores';

import { currentState, recordState, hardware_abort_active, notificationBanner } from '../stores';

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

	const toggleRecording = async () => {
		const currentRecordState = get(recordState);
		const newRecordState = !currentRecordState;

		console.log('Toggling recording state from', currentRecordState, 'to', newRecordState);
		recordState.set(newRecordState);

		await pocketbase.collection('RecordingWindow').create({
			start_stop: newRecordState
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

	const downloadAllCSVs = async () => {
		let start_recording_time: string | undefined;
		let end_recording_time: string | undefined;

		try {
			const entries = await pocketbase.collection('RecordingWindow').getList(1, 2, { sort: '-created' });
			if (entries.items.length >= 2) {
				const [latest, secondLatest] = entries.items;

				if (secondLatest.start_stop !== true || latest.start_stop !== false) {
					console.error('Invalid state: second latest is not true or latest is not false.');
					// Display a banner to notify the user
					notificationBanner.set({
						type: 'error',
						message: 'Cannot download while recording.'
					});
					return;
				}

				console.log('Latest created time:', latest.created);
				console.log('Second latest created time:', secondLatest.created);
				start_recording_time = secondLatest.created;
				end_recording_time = latest.created;
			} else if (entries.items.length === 1) {
				console.log('Only one entry found. Latest created time:', entries.items[0].created);
				notificationBanner.set({
					type: 'error',
					message: 'Unresolvable time range.'
				});
				return;
			} else {
				console.warn('No entries found in RecordingWindow.');
				notificationBanner.set({
					type: 'error',
					message: 'No time range.'
				});
				return;
			}
		} catch (error) {
			console.error('Error fetching the last two RecordingWindow entries:', error);
			notificationBanner.set({
				type: 'error',
				message: 'Failed to download CSVs.'
			});
			return;
		}

		try {
			await downloadLabJackCSV(start_recording_time, end_recording_time);
			await downloadPlcCSV(start_recording_time, end_recording_time);
			console.log('Both CSV files have been downloaded successfully.');
		} catch (error) {
			console.error('Error downloading CSV files:', error);
		}
		notificationBanner.set({
			type: 'success',
			message: 'Downloaded CSV files.'
		});
	};

	const downloadLabJackCSV = async (startTime: string, endTime: string) => {

		try {
			// 1. Fetch records from PocketBase within a specific date range
			const startDate = new Date(startTime).toISOString().replace('T', ' ').replace('Z', ''); // Replace with your desired start date
			const endDate = new Date(endTime).toISOString().replace('T', ' ').replace('Z', ''); // Convert to "YYYY-MM-DD HH:mm:ss.sss" format
			console.log('filter:', `created >= "${startDate}" && created <= "${endDate}"`);

			const records = await pocketbase.collection('LabJack').getFullList({
				filter: `created >= "${startDate}" && created <= "${endDate}"`,
			});

			console.log('Fetched records:', records.length);

			if (!records.length) {
				console.warn('No records found for LabJack.');
				return;
			}

			// 2. Prepare CSV headers
			const headers = [
				"time",
				"LC3", "LC4", "LC5", "LC6",
				"PT6", "PT7", "PT8", "PT9", "PT10", "PT11", "PT12", "PT13", "PT14"
			];
			const csvRows: string[] = [headers.join(',')];

			// 3. Process records
			let previousTime: string | null = null;
			let allCurrentTimeEntries: string[] = [];

			for (const record of records) {
				const currentTime = record.created;

				if (previousTime === null) {
					previousTime = currentTime;
				}

				// Process entries for the current record
				for (let i = 0; i < record.LC3.length; i++) {
					const entry = [
						record.LC3[i] ?? '',
						record.LC4[i] ?? '',
						record.LC5[i] ?? '',
						record.LC6[i] ?? '',
						Math.round(record.PT6[i] * 145) ?? '',
						Math.round(record.PT7[i] * 145) ?? '',
						Math.round(record.PT8[i] * 145) ?? '',
						Math.round(record.PT9[i] * 580) ?? '',
						Math.round(record.PT10[i] * 580) ?? '',
						Math.round(record.PT11[i] * 145) ?? '',
						Math.round(record.PT12[i] * 145) ?? '',
						Math.round(record.PT13[i] * 145) ?? '',
						Math.round(record.PT14[i] * 145) ?? ''
					].join(',');

					allCurrentTimeEntries.push(entry);
				}

				// Write entries if the timestamp changes
				if (currentTime !== previousTime) {
					const numEntries = allCurrentTimeEntries.length;
					const timeStep = 1000 / numEntries;
					let entryTime = new Date(previousTime).getTime();

					for (const entry of allCurrentTimeEntries) {
						csvRows.push(`${new Date(entryTime).toISOString()},${entry}`);
						entryTime += timeStep;
					}

					allCurrentTimeEntries = [];
					previousTime = currentTime;
				}
			}

			// Handle remaining entries
			if (allCurrentTimeEntries.length > 0) {
				const numEntries = allCurrentTimeEntries.length;
				const timeStep = 1000 / numEntries;
				let entryTime = new Date(previousTime).getTime();

				for (const entry of allCurrentTimeEntries) {
					csvRows.push(`${new Date(entryTime).toISOString()},${entry}`);
					entryTime += timeStep;
				}
			}

			// 4. Build and download CSV
			const csv = csvRows.join('\n');
			const blob = new Blob([csv], { type: 'text/csv' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'LabJackData.csv';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			console.log('Generated CSV:', csv);
			console.log('Blob URL:', url);

		} catch (err) {
			console.error('Failed to download CSV:', err);
		}
	};

	const downloadPlcCSV = async (startTime: string, endTime: string) => {
		try {
			// 1. Fetch all records from the PLC collection
			const startDate = new Date(startTime).toISOString().replace('T', ' ').replace('Z', ''); // Replace with your desired start date
			const endDate = new Date(endTime).toISOString().replace('T', ' ').replace('Z', ''); // Convert to "YYYY-MM-DD HH:mm:ss.sss" format
			console.log('filter:', `created >= "${startDate}" && created <= "${endDate}"`);

			const records = await pocketbase.collection('Plc').getFullList({
				filter: `created >= "${startDate}" && created <= "${endDate}"`,
			});

			if (!records.length) {
				console.warn('No records found for PLC.');
				return;
			}

			// 2. Prepare CSV headers
			const headers = [
				"time",
				"PBV1", "PBV2", "PBV3", "PBV4", "PBV5", "PBV6", "PBV7", "PBV8", "PBV9", "PBV10", "PBV11",
				"SOL1", "SOL2", "SOL3", "SOL4", "SOL5",
				"IGN1", "IGN2",
				"PT1", "PT2", "PT3", "PT4", "PT5",
				"TC1", "TC2", "TC3", "TC4", "TC5", "TC6",
				"LC1", "LC2", "LC7"
			];
			const csvRows: string[] = [headers.join(',')];

			// 3. Process records
			let previousTime: string | null = null;
			let allCurrentTimeEntries: string[] = [];

			for (const record of records) {
				const currentTime = record.created;

				if (previousTime === null) {
					previousTime = currentTime;
				}

				// Process entries for the current record
				for (let i = 0; i < record.PBV1.length; i++) {
					const entry = [
						record.PBV1[i] ?? '', record.PBV2[i] ?? '', record.PBV3[i] ?? '', record.PBV4[i] ?? '',
						record.PBV5[i] ?? '', record.PBV6[i] ?? '', record.PBV7[i] ?? '', record.PBV8[i] ?? '',
						record.PBV9[i] ?? '', record.PBV10[i] ?? '', record.PBV11[i] ?? '',
						record.SOL1[i] ?? '', record.SOL2[i] ?? '', record.SOL3[i] ?? '', record.SOL4[i] ?? '',
						record.SOL5[i] ?? '',
						record.IGN1[i] ?? '', record.IGN2[i] ?? '',
						Math.round(record.PT1[i] * 14.5) ?? '', Math.round(record.PT2[i] * 580) ?? '',
						Math.round(record.PT3[i] * 580) ?? '', Math.round(record.PT4[i] * 145) ?? '',
						Math.round(record.PT5[i] * 145) ?? '',
						record.TC1[i] ?? '', record.TC2[i] ?? '', record.TC3[i] ?? '',
						record.TC4[i] ?? '', record.TC5[i] ?? '', record.TC6[i] ?? '',
						record.LC1[i] ?? '', record.LC2[i] ?? '', record.LC7[i] ?? ''
					].join(',');

					allCurrentTimeEntries.push(entry);
				}

				// Write entries if the timestamp changes
				if (currentTime !== previousTime) {
					const numEntries = allCurrentTimeEntries.length;
					const timeStep = 1000 / numEntries;
					let entryTime = new Date(previousTime).getTime();

					for (const entry of allCurrentTimeEntries) {
						csvRows.push(`${new Date(entryTime).toISOString()},${entry}`);
						entryTime += timeStep;
					}

					allCurrentTimeEntries = [];
					previousTime = currentTime;
				}
			}

			// Handle remaining entries
			if (allCurrentTimeEntries.length > 0) {
				const numEntries = allCurrentTimeEntries.length;
				const timeStep = 1000 / numEntries;
				let entryTime = new Date(previousTime).getTime();

				for (const entry of allCurrentTimeEntries) {
					csvRows.push(`${new Date(entryTime).toISOString()},${entry}`);
					entryTime += timeStep;
				}
			}

			// 4. Build and download CSV
			const csv = csvRows.join('\n');
			const blob = new Blob([csv], { type: 'text/csv' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'PlcData.csv';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

		} catch (err) {
			console.error('Failed to download PLC CSV:', err);
		}
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

		// Fetch the most recent entry and set the recordState
		(async () => {
			try {
				const latestEntry = await pocketbase.collection('RecordingWindow').getList(1, 1, { sort: '-created' });
				if (latestEntry.items.length > 0) {
					recordState.set(latestEntry.items[0].start_stop);
				}
			} catch (error) {
				recordState.set(false);
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
		subscribeToCollections,
		toggleRecording,
		downloadAllCSVs,
	};
};