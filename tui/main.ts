import blessed from 'blessed';
import bcontrib from 'blessed-contrib';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import createStore from '../src/store/store';
import {logCampLine, reset} from "../src/store/actions";

dayjs.extend(duration)

const store = createStore();

const screen = blessed.screen({
    smartCSR: true,
    title: 'Warbands',
});

screen.key(['escape', 'C-c'], () => {
    return process.exit(0);
});

const table = bcontrib.table({
    keys: true,
    interactive: true as any,
    width: '100%',
    height: '100%-3',
    columnSpacing: 2,
    columnWidth: [
        3, 3, 15, // w, loc, state
        4, 4, 4, 5, 8, // h c m s f
        6, 6, 6 // pker timer done
    ],
});
screen.append(table);
const tableHeader = ['W', 'Loc', 'State', 'Herb', 'Cons', 'Mine', 'Smith', 'Farm', 'Pker', 'Timer', 'Done'];
table.setData({
    headers: tableHeader,
    data: [],
});

const input = blessed.textbox({
    label: 'Enter call / "reset" to clear',
    parent: screen,
    bottom: 0,
    shadow: true,
    height: 3,
    border: 'line',
    keys: true,
});
input.focus();

input.on('submit', (value: string) => {
    if (value.toLowerCase() === 'reset') {
        store.dispatch(reset());
    } else {
        store.dispatch(logCampLine(value));
    }
    input.clearValue();
});

function tf(val: boolean|null): string {
    return val ? '✔️️' : '';
}

function updateTable(){
    const state = store.getState();
    const now = dayjs();
    table.setData({
        headers: tableHeader,
        data: state.camps.map((camp) => {
            let diff = dayjs.duration(camp.endTime.diff(now));
            return [
                camp.world.toString(),
                camp.location || '',
                camp.state,
                tf(camp.tents && camp.tents.includes('H')),
                tf(camp.tents && camp.tents.includes('C')),
                tf(camp.tents && camp.tents.includes('M')),
                tf(camp.tents && camp.tents.includes('S')),
                tf(camp.tents && camp.tents.includes('F')),
                tf(camp.pker),
                diff.format('m:ss'),
                '',
            ];
        }),
    });
    screen.render();
}

setInterval(updateTable, 1000);
store.subscribe(updateTable)

screen.render();
