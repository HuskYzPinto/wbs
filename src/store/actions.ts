import { parseChatLine, WarbandInfo } from '../libs/parser';
import { Action } from './type';

export const LOG_CAMP = Symbol('LOG_CAMP');
export const RESET = Symbol('RESET');

export function logCamp(info: Partial<WarbandInfo>): Action {
	return {
		type: LOG_CAMP,
		info: info,
	};
}

export function logCampLine(line: string): Action {
	let parsed = parseChatLine(line);
	if (!parsed) {
		return { type: Symbol('invalid') };
	}

	return logCamp(parsed);
}

export function reset(): Action {
	return {
		type: RESET,
	};
}
