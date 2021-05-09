import { parseChatLine, WarbandInfo } from '../libs/parser';
import { Action } from './type';

export const LOG_CAMP = Symbol('LOG_CAMP');
export const RESET = Symbol('RESET');
export const DONE = Symbol('DONE');
export const TICK = Symbol('TICK');

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

export function done(world: number, value = true): Action {
	return { type: DONE, world, done: value };
}

export function reset(): Action {
	return {
		type: RESET,
	};
}

export function tick(): Action {
	return {
		type: TICK,
	};
}
