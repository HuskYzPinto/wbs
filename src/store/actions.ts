import { parseChatLine, WarbandInfo } from '../libs/parser';
import { Action } from './type';

export const LOG_CAMP = Symbol('LOG_CAMP');
export const RESET = Symbol('RESET');
export const DONE = Symbol('DONE');

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

export function done(info: Partial<WarbandInfo>): Action {
	return {type: DONE,
		info: info,
	};
}

export function reset(): Action {
	return {
		type: RESET,
	};
}
