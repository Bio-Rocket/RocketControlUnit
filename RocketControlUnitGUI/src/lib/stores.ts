import { writable, type Writable } from 'svelte/store';

export const currentState = writable('N/A');
export const auth = writable(false);

const isBrowser = typeof window !== 'undefined';
const storedOperationConfig = isBrowser ? localStorage.getItem('operationConfig') || 'Static Fire' : 'Static Fire';
export const operationConfig = writable(storedOperationConfig);

if (isBrowser) {
    operationConfig.subscribe(value => {
        localStorage.setItem('operationConfig', value);
    });
}

export interface Stores {
	pbv1_open: Writable<any>;
	pbv2_open: Writable<any>;
	pbv3_open: Writable<any>;
	pbv4_open: Writable<any>;
    pbv5_open: Writable<any>;
    pbv6_open: Writable<any>;
    pbv7_open: Writable<any>;
    pbv8_open: Writable<any>;
    pbv9_open: Writable<any>;
    pbv10_open: Writable<any>;
    pbv11_open: Writable<any>;
    sol1_open: Writable<any>;
    sol2_open: Writable<any>;
    sol3_open: Writable<any>;
    sol4_open: Writable<any>;
	sol5_open: Writable<any>;
    ign1_on: Writable<any>;
    ign2_on: Writable<any>;
    pt1_pressure: Writable<string | number | undefined>;
	pt2_pressure: Writable<string | number | undefined>;
	pt3_pressure: Writable<string | number | undefined>;
	pt4_pressure: Writable<string | number | undefined>;
    pt5_pressure: Writable<string | number | undefined>;
    pt6_pressure: Writable<string | number | undefined>;
    pt7_pressure: Writable<string | number | undefined>;
    pt8_pressure: Writable<string | number | undefined>;
    pt9_pressure: Writable<string | number | undefined>;
    pt10_pressure: Writable<string | number | undefined>;
    pt11_pressure: Writable<string | number | undefined>;
    pt12_pressure: Writable<string | number | undefined>;
    pt15_pressure: Writable<string | number | undefined>;
    pt16_pressure: Writable<string | number | undefined>;
    pt17_pressure: Writable<string | number | undefined>;
    pt18_pressure: Writable<string | number | undefined>;
    pt19_pressure: Writable<string | number | undefined>;
	tc1_temperature: Writable<string | number | undefined>;
	tc2_temperature: Writable<string | number | undefined>;
    tc3_temperature: Writable<string | number | undefined>;
    tc4_temperature: Writable<string | number | undefined>;
    tc5_temperature: Writable<string | number | undefined>;
    tc6_temperature: Writable<string | number | undefined>;
    tc10_temperature: Writable<string | number | undefined>;
    tc11_temperature: Writable<string | number | undefined>;
    tc12_temperature: Writable<string | number | undefined>;
    lc1_mass: Writable<string | number | undefined>;
    lc2_mass: Writable<string | number | undefined>;
    lc3_mass: Writable<string | number | undefined>;
    lc4_mass: Writable<string | number | undefined>;
    lc5_mass: Writable<string | number | undefined>;
    lc6_mass: Writable<string | number | undefined>;
    lc7_mass: Writable<string | number | undefined>;
}

export const initStores = () => {
	return {
		pbv1_open: writable(undefined),
		pbv2_open: writable(undefined),
		pbv3_open: writable(undefined),
		pbv4_open: writable(undefined),
        pbv5_open: writable(undefined),
        pbv6_open: writable(undefined),
        pbv7_open: writable(undefined),
        pbv8_open: writable(undefined),
        pbv9_open: writable(undefined),
        pbv10_open: writable(undefined),
        pbv11_open: writable(undefined),
        sol1_open: writable(undefined),
        sol2_open: writable(undefined),
        sol3_open: writable(undefined),
        sol4_open: writable(undefined),
		sol5_open: writable(undefined),
        ign1_on: writable(undefined),
        ign2_on: writable(undefined),
        pt1_pressure: writable<string | number | undefined>(undefined),
        pt2_pressure: writable<string | number | undefined>(undefined),
        pt3_pressure: writable<string | number | undefined>(undefined),
        pt4_pressure: writable<string | number | undefined>(undefined),
        pt5_pressure: writable<string | number | undefined>(undefined),
        pt6_pressure: writable<string | number | undefined>(undefined),
        pt7_pressure: writable<string | number | undefined>(undefined),
        pt8_pressure: writable<string | number | undefined>(undefined),
        pt9_pressure: writable<string | number | undefined>(undefined),
        pt10_pressure: writable<string | number | undefined>(undefined),
        pt11_pressure: writable<string | number | undefined>(undefined),
        pt12_pressure: writable<string | number | undefined>(undefined),
        pt15_pressure: writable<string | number | undefined>(undefined),
        pt16_pressure: writable<string | number | undefined>(undefined),
        pt17_pressure: writable<string | number | undefined>(undefined),
        pt18_pressure: writable<string | number | undefined>(undefined),
        pt19_pressure: writable<string | number | undefined>(undefined),
        tc1_temperature: writable<string | number | undefined>(undefined),
        tc2_temperature: writable<string | number | undefined>(undefined),
        tc3_temperature: writable<string | number | undefined>(undefined),
        tc4_temperature: writable<string | number | undefined>(undefined),
        tc5_temperature: writable<string | number | undefined>(undefined),
        tc6_temperature: writable<string | number | undefined>(undefined),
        tc10_temperature: writable<string | number | undefined>(undefined),
        tc11_temperature: writable<string | number | undefined>(undefined),
        tc12_temperature: writable<string | number | undefined>(undefined),
        lc1_mass: writable<string | number | undefined>(undefined),
        lc2_mass: writable<string | number | undefined>(undefined),
        lc3_mass: writable<string | number | undefined>(undefined),
        lc4_mass: writable<string | number | undefined>(undefined),
        lc5_mass: writable<string | number | undefined>(undefined),
        lc6_mass: writable<string | number | undefined>(undefined),
        lc7_mass: writable<string | number | undefined>(undefined),
	};
};