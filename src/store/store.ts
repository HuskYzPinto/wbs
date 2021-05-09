import { createStore } from 'redux';
import { findIndex } from 'lodash';
import produce, {enableMapSet} from 'immer';
import dayjs from 'dayjs';
import {LOG_CAMP, RESET, DONE, TICK, tick} from './actions';
import { Action, Camp, Store } from './type';
import { WarbandInfo } from '../libs/parser';

enableMapSet();

function createCamp(state: Store, info: Partial<WarbandInfo>) {
	return produce(state, (draft) => {
		// camp not found, add it
		let campInfo: Camp = {
			world: info.world!,
			endTime: dayjs().add(10, 'minute'),
			location: info.location || null,
			pker: info.pker || false,
			state: 'new',
			tents: info.tents || null,
			done: false,
		};

		if (info.state === 'broken' || info.state === 'fighting') {
			campInfo.state = 'fighting';
			campInfo.endTime = dayjs().add(5, 'minute');
		} else if (info.state === 'looting') {
			campInfo.state = 'looting';
		} else if (info.state === 'dead' || info.state === 'empty') {
			// i don't want to add any more, why tell me now
			draft.emptiedWorlds.add(info.world!);
			return;
		}

		if (info.tents && !info.state) {
			campInfo.state = 'fighting';
		}

		draft.camps.push(campInfo);
		draft.camps.sort((a, b) => a.world - b.world);
	});
}

function _reducer(state: Store | undefined, action: Action): Store {
	if (!state || action.type === RESET) {
		return {
			camps: [],
			emptiedWorlds: new Set<number>(),
		};
	}

	switch (action.type) {
		case LOG_CAMP:
			let info: Partial<WarbandInfo> = action.info;
			let campIndex = findIndex(
				state.camps,
				(item) => item.world === info.world
			);
			if (campIndex === -1) {
				if (state.emptiedWorlds.has(info.world!)) {
					// don't revive dead world
					return state;
				}
				return createCamp(state, info);
			}
			return produce(state, (draft) => {
				if (info.state === 'dead' || info.state === 'empty') {
					draft.camps.splice(campIndex, 1);
					draft.emptiedWorlds.add(info.world!);
					return;
				}

				let camp = draft.camps[campIndex];
				camp.location = info.location || camp.location;
				if (camp.tents && info.tents) {
					camp.tents = camp.tents.concat(info.tents.filter(tent => !camp.tents!.includes(tent))).slice(0, 3) as typeof camp.tents;
				} else {
					camp.tents = info.tents || camp.tents;
				}

				if (camp.tents && camp.state === 'new') {
					camp.state = 'fighting';
				}

				if (info.pker !== undefined) {
					camp.pker = info.pker;
				}
				if (info.state === 'broken') {
					camp.state = 'fighting';

					if (camp.endTime.isAfter(dayjs().add(5, 'minute'))) {
						camp.endTime = dayjs().add(5, 'minute');
					}
				} else if (info.state === 'fighting') {
					camp.state = 'fighting';
				} else if (info.state === 'looting') {
					camp.state = 'looting';
				}

				if (info.timer) {
					camp.endTime = dayjs().add(info.timer, 's');
				}

				if (
					camp.state === 'fighting' &&
					state.camps[campIndex].state !== 'fighting' &&
					info.state !== 'broken'
				) {
					camp.endTime = camp.endTime.add(5, 'minute');
				}
			});
		case DONE:
			return produce(state, (draft) => {
				let campIndex = findIndex(
					draft.camps,
					(item) => item.world === action.world
				);
				let camp = draft.camps[campIndex];
				camp.done = action.done;
			});
		case TICK:
			return produce(state, (draft) => {
				let now = dayjs();
				let removingWorlds: number[] = [];
				for(let camp of draft.camps) {
					if (camp.endTime.isBefore(now)) {
						removingWorlds.push(camp.world);
						draft.emptiedWorlds.add(camp.world);
					}
				}
				if (removingWorlds.length === 0) {
					return;
				}

				draft.camps = draft.camps.filter((camp) => !removingWorlds.includes(camp.world));
			});
		default:
			return state;
	}
}

export default function storeFactory(initialState?: Store) {
	let out = createStore(
		_reducer,
		initialState,
		typeof window !== 'undefined'
			? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
					(window as any).__REDUX_DEVTOOLS_EXTENSION__()
			: undefined
	);
	setInterval(() => {
		out.dispatch(tick());
	}, 5000);
	return out;
}
