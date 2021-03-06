import { parse } from './grammar';

export type Tent = 'H' | 'C' | 'S' | 'M' | 'F';
export type ReportState = 'broken' | 'fighting' | 'looting' | 'dead' | 'empty';
export type Location = 'DWF' | 'ELM' | 'RDI';

export interface WarbandInfo {
	world: number;
	location: Location | null;
	tents: [Tent, Tent, Tent] | null;
	pker: boolean;
	timer: number | null; // time in seconds
	state: ReportState | null;
	done: boolean | null;
}

export function parseChatLine(message: string): Partial<WarbandInfo> | null {
	try {
		let result = parse(message);
		if (
			result.location == null &&
			result.tents == null &&
			result.pker == null &&
			result.timer == null &&
			result.state == null
		) {
			result = null;
		} else if (result.pker == true && result.state == 'fighting') {
			delete result.state;
		}
		return result;
	} catch (e) {
		return null;
	}
}
