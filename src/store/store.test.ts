import MockDate from 'mockdate';
import createStore from './store';
import {logCamp, logCampLine, reset, tick} from './actions';
import { ReportState } from '../libs/parser';
import dayjs from 'dayjs';

let now = dayjs();

beforeEach(() => {
	MockDate.set(now.toDate());
});
afterAll(() => {
	MockDate.reset();
});

test('default store state', () => {
	expect(createStore().getState()).toEqual({
		camps: [],
		emptiedWorlds: new Set(),
	});
});

describe('logCamp', () => {
	test('store the camp', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: now.add(10, 'minute'),
				state: 'new',
				tents: null,
				done: false,
			},
		]);
	});

	test('store multiple camp must be sorted', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 2,
				location: 'ELM',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: expect.anything(),
				state: 'new',
				tents: null,
				done: false,
			},
			{
				world: 2,
				location: 'ELM',
				pker: false,
				endTime: expect.anything(),
				state: 'new',
				tents: null,
				done: false,
			},
		]);
	});

	test('handle duplicate calls', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		MockDate.set(now.add(2, 'minute').toDate());
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: now.add(10, 'minute'),
				state: 'new',
				tents: null,
				done: false,
			},
		]);
	});

	test('update info fighting', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				tents: ['H', 'C', 'S'],
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: now.add(15, 'minute'),
				state: 'fighting',
				tents: ['H', 'C', 'S'],
				done: false,
			},
		]);
	});

	test('update info looting', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
				state: 'fighting',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				tents: ['H', 'C', 'S'],
				state: 'looting',
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: expect.anything(),
				state: 'looting',
				tents: ['H', 'C', 'S'],
				done: false,
			},
		]);
	});

	test('update info timer', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				state: 'looting',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				timer: 4 * 60,
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: null,
				pker: false,
				endTime: now.add(4, 'minute'),
				state: 'looting',
				tents: null,
				done: false,
			},
		]);
	});

	test('update info pker', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				state: 'looting',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				pker: true,
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: null,
				pker: true,
				endTime: expect.anything(),
				state: 'looting',
				tents: null,
				done: false,
			},
		]);
	});

	test('update camp with tent must change state to fighting', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				tents: ['H', 'C', 'S'],
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: now.add(15, 'minute'),
				state: 'fighting',
				tents: ['H', 'C', 'S'],
				done: false,
			},
		]);
	});

	test('update camp with partial tent must not lose tent state', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
				tents: ['H', 'C', 'S'],
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				tents: ['H'],
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: expect.anything(),
				state: 'fighting',
				tents: ['H', 'C', 'S'],
				done: false,
			},
		]);
	});

	test('update camp with tent while looting must not revert state', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
				state: 'looting',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				tents: ['H', 'C', 'S'],
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: now.add(10, 'minute'),
				state: 'looting',
				tents: ['H', 'C', 'S'],
				done: false,
			},
		]);
	});

	test('update camp with broken set timer to 5 min', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				state: 'broken',
			})
		);
		expect(store.getState().camps).toEqual([
			{
				world: 1,
				location: 'DWF',
				pker: false,
				endTime: now.add(5, 'minute'),
				state: 'fighting',
				tents: null,
				done: false,
			},
		]);
	});

	test.each(['dead', 'empty'])('remove %s camp', (state) => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
				location: 'DWF',
			})
		);
		store.dispatch(
			logCamp({
				world: 2,
				location: 'ELM',
			})
		);
		store.dispatch(
			logCamp({
				world: 1,
				state: state as ReportState,
			})
		);
		expect(store.getState()).toEqual({
			camps: [
				{
					world: 2,
					location: 'ELM',
					pker: false,
					endTime: expect.anything(),
					state: 'new',
					tents: null,
					done: false,
				},
			],
			emptiedWorlds: new Set([1]),
		});
	});

	test('add info on dead camp doesn\'t do anything', () => {
		let store = createStore();
		store.dispatch(
			logCamp({
				world: 1,
			})
		);
		expect(store.getState().camps).toHaveLength(1);

		store.dispatch(
			logCamp({
				world: 1,
				state: 'dead',
			})
		);
		let state = store.getState();
		expect(state.camps).toHaveLength(0);
		expect(state.emptiedWorlds.size).toEqual(1);

		store.dispatch(
			logCamp({
				world: 1,
				pker: true,
			})
		);
		expect(store.getState().camps).toHaveLength(0);
	});
});

describe('logCampLine', () => {
	test('invalid', () => {
		let store = createStore();
		store.dispatch(logCampLine('invalid'));
		expect(store.getState()).toEqual({
			camps: [],
			emptiedWorlds: new Set(),
		});
	});
});

test('reset', () => {
	let store = createStore();
	store.dispatch(
		logCamp({
			world: 1,
			location: 'DWF',
		})
	);
	store.dispatch(reset());
	expect(store.getState()).toEqual({
		camps: [],
		emptiedWorlds: new Set(),
	});
});

test('tick', () => {
	let store = createStore();
	store.dispatch(
		logCamp({
			world: 1,
			location: 'DWF',
		})
	);
	store.dispatch(
		logCamp({
			world: 1,
			timer: -1000000,
		})
	);
	store.dispatch(tick());
	expect(store.getState().camps).toHaveLength(0);
	expect(store.getState().emptiedWorlds).toEqual(new Set([1]));
})
