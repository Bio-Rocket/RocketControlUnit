export interface Timestamps {
	relay_status: number;
	combustion_control_status: number;
	rcu_temp: number;
	pad_box_status: number;
	battery: number;
	dmb_pressure: number;
	launch_rail_load_cell: number;
	nos_load_cell: number;
	pbb_pressure: number;
	pbb_temperature: number;
	rcu_pressure: number;
	sob_temperature: number;
	sys_state: number;
	heartbeat: number;
}

export const initTimestamps = () => {
	const now = Date.now();

	return {
		relay_status: now,
		combustion_control_status: now,
		rcu_temp: now,
		pad_box_status: now,
		battery: now,
		dmb_pressure: now,
		launch_rail_load_cell: now,
		nos_load_cell: now,
		pbb_pressure: now,
		pbb_temperature: now,
		rcu_pressure: now,
		sob_temperature: now,
		sys_state: now,
		heartbeat: now
	};
};