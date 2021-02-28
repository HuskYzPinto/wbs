import { createStore } from 'redux';
import { findIndex } from 'lodash';
import produce, { current } from 'immer';
import dayjs from 'dayjs';
import { LOG_CAMP, RESET, DONE } from './actions';
import { Action, Camp, Store } from './type';
import { WarbandInfo } from '../libs/parser';

function _reducer(state: Store | undefined, action: Action): Store {
	if (!state || action.type === RESET) {
		return {
			camps: [],
		};
	}

	switch (action.type) {
		case LOG_CAMP:
			let info: Partial<WarbandInfo> = action.info;
			return produce(state, (draft) => {
				let campIndex = findIndex(
					draft.camps,
					(item) => item.world === info.world
				);
				if (campIndex === -1) {
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
					} else if (info.state === 'looting') {
						campInfo.state = 'looting';
					} else if (info.state === 'dead' || info.state === 'empty') {
						// i don't want to add any more, why tell me now
						return;
					}

					if (info.tents && !info.state) {
						campInfo.state = 'fighting';
					}

					draft.camps.push(campInfo);
					draft.camps.sort((a, b) => a.world - b.world);
					return;
				}

				if (info.state === 'dead' || info.state === 'empty') {
					draft.camps.splice(campIndex, 1);
					return;
				}

				let camp = draft.camps[campIndex];
				camp.location = info.location || camp.location;
				camp.tents = info.tents || camp.tents;

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

				if (
					camp.state === 'fighting' &&
					state.camps[campIndex].state !== 'fighting' &&
					info.state !== 'broken'
				) {
					camp.endTime = camp.endTime.add(5, 'minute');
				}
			});
		
		case DONE:
			let currentWorld: Partial<WarbandInfo> = action.info;
			console.log(currentWorld);
			return produce(state, (draft) => {
				let campIndex = findIndex(
					draft.camps,
					(item) => item.world === currentWorld.world
				);
				let camp = draft.camps[campIndex];
				camp.done = true;
			});

		default:
			return state;
	}
}

export default function (initialState?: Store) {
	let out = createStore(
		_reducer,
		initialState,
		typeof window !== 'undefined'
			? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
					(window as any).__REDUX_DEVTOOLS_EXTENSION__()
			: undefined
	);
	return out;
}
