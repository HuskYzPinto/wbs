import type { Location, WarbandInfo } from '../libs/parser';
import dayjs from 'dayjs';

export type CampState = 'new' | 'fighting' | 'looting';

export interface Camp {
	world: number;
	location: Location | null;
	tents: WarbandInfo["tents"];
	pker: boolean;
	endTime: dayjs.Dayjs;
	state: CampState;
	done: boolean;
}

export interface Store {
	camps: Camp[];
}

export type Action = { type: Symbol; [key: string]: any };
