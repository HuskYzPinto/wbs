import {parse} from './grammar';

export type Tent = 'H' | 'C' | 'S' | 'M' | 'F';
export type ReportState = 'broken' | 'fighting' | 'looting' | 'dead' | 'empty';
export type Location = 'DWF' | 'ELM' | 'RDI';

export interface WarbandInfo {
	world: number;
	location: Location | null;
	tents: [Tent, Tent, Tent] | [Tent, Tent] | [Tent] | null;
	pker: boolean;
	timer: number | null; // time in seconds
	state: ReportState | null;
	done: boolean | null;
}

export function parseChatLine(message: string): Partial<WarbandInfo> | null {
	try {
		let result = parse(message);
		if (
			!result.location &&
			!result.tents &&
			!result.pker &&
			!result.timer &&
			!result.state
		) {
			result = null;
		} else if (result.pker && result.state === 'fighting') {
			delete result.state;
		}
		return result;
	} catch (e) {
		return null;
	}
}
