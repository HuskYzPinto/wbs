import { Tent, Location } from '../libs/parser';
import dayjs from 'dayjs';

export type CampState = 'new' | 'fighting' | 'looting';

export interface Camp {
	world: number;
	location: Location | null;
	tents: [Tent, Tent, Tent] | null;
	pker: boolean;
	endTime: dayjs.Dayjs;
	state: CampState;
}

export interface Store {
	camps: Camp[];
}

export type Action = { type: Symbol; [key: string]: any };
