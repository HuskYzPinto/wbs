/** @jsx jsx */
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {done} from '../store/actions';
import {Location, Tent} from '../libs/parser';
import {Camp} from '../store/type';
import {css, jsx} from '@emotion/react'
import Timer from './Timer';

const toolbarStyle = css`
    padding: 5px 10px;
`
const tableStyle = css`
	width: 100%;
	.nisbutton2 {
		width: 100%;
	}
	td {
		padding: 0 3px;
	}
`;
const doneColStyle = css`
	width: 80px;
`;
const tentStyle = css`
	width: 50px;
	text-align: center;
`

type SortKeyer = (camp: Camp) => any;
type SortKey = keyof Camp | Tent;

enum SortDirection {
    Ascending = 0,
    Descending = 1,
}

interface Props {
}

const sortKeyer: { readonly [key in SortKey]?: SortKeyer } = {
    world: (c) => c.world,
    location: (c) => c.location,
    done: (c) => (c.done ? 0 : 1),
    pker: (c) => (c.pker ? 0 : 1),
    state: (c) => c.state,
    endTime: (c) => c.endTime.unix(),
    C: (c) => (c.tents?.includes('C') ? 0 : 1),
    S: (c) => (c.tents?.includes('S') ? 0 : 1),
    H: (c) => (c.tents?.includes('H') ? 0 : 1),
    M: (c) => (c.tents?.includes('M') ? 0 : 1),
    F: (c) => (c.tents?.includes('F') ? 0 : 1),
};

const WbTable: React.FC<Props> = (props: any) => {
    const state = useSelector((state) => state.camps);
    const [locationFilter, setLocationFilter] = useState<Location|''>('');
    const dispatch = useDispatch();

    const camps: Camp[] = state;
    const [sortConfig, setSortConfig] = useState<{
        key: SortKey;
        direction: SortDirection;
    } | null>(null);

    const onLocationChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setLocationFilter(e.target.value as typeof locationFilter);
    }

    const requestSort = (key: SortKey) => {
        let direction = SortDirection.Ascending;
        if (sortConfig) {
            if (
                sortConfig.key === key &&
                sortConfig.direction === SortDirection.Ascending
            ) {
                direction = SortDirection.Descending;
            }
        }
        setSortConfig({key, direction});
    };

    let sortedCamps: Camp[] = [...camps];

    if (locationFilter) {
        sortedCamps = sortedCamps.filter((camp) => camp.location === locationFilter);
    }

    if (sortConfig !== null) {
        sortedCamps.sort((a: Camp, b: Camp) => {
            let aKey = sortKeyer[sortConfig.key]!(a);
            let bKey = sortKeyer[sortConfig.key]!(b);

            if (aKey < bKey) {
                return sortConfig.direction === SortDirection.Ascending ? -1 : 1;
            } else if (aKey > bKey) {
                return sortConfig.direction === SortDirection.Ascending ? 1 : -1;
            }
            return 0;
        });
    }

    const boolText = (info: boolean | null) => {
        if (info) {
            return <span css={css`color: #0f0;`}>✅</span>;
        } else {
            return <span css={css`color: maroon;`}>❌</span>;
        }
    };

    const checkTent = (tents: Array<string> | null, skill: string) => {
        if (tents) {
            return tents.includes(skill);
        } else {
            return null;
        }
    };

    const output = sortedCamps.map((camp) => (
        <tr key={camp.world}>
            <td>{camp.world}</td>
            <td>{camp.location}</td>
            <td css={tentStyle}>{boolText(checkTent(camp.tents, 'C'))}</td>
            <td css={tentStyle}>{boolText(checkTent(camp.tents, 'S'))}</td>
            <td css={tentStyle}>{boolText(checkTent(camp.tents, 'M'))}</td>
            <td css={tentStyle}>{boolText(checkTent(camp.tents, 'H'))}</td>
            <td css={tentStyle}>{boolText(checkTent(camp.tents, 'F'))}</td>
            <td css={tentStyle}>{boolText(camp.pker)}</td>
            <td css={tentStyle}>{boolText(camp.done)}</td>
            <td css={tentStyle}>{camp.state}</td>
            <td><Timer time={camp.endTime}/></td>
            <td css={doneColStyle}>
                <button
                    className="nisbutton2"
                    onClick={() => {
                        dispatch(done(camp.world, !camp.done));
                    }}>
                    Done
                </button>
            </td>
        </tr>
    ));
    return (
        <div>
            <div css={toolbarStyle}>
                Location: <select value={locationFilter} onChange={onLocationChange} className="nisdropdown">
                    <option value="">Any</option>
                    <option>DWF</option>
                    <option>ELM</option>
                    <option>RDI</option>
                </select>
            </div>
            <table css={tableStyle} className="nistable">
                <thead>
                <tr>
                    <th>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('world')}>
                            World
                        </button>
                    </th>
                    <th>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('location')}>
                            Location
                        </button>
                    </th>
                    <th css={tentStyle}>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('C')}>
                            C
                        </button>
                    </th>
                    <th css={tentStyle}>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('S')}>
                            S
                        </button>
                    </th>
                    <th css={tentStyle}>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('M')}>
                            M
                        </button>
                    </th>
                    <th css={tentStyle}>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('H')}>
                            H
                        </button>
                    </th>
                    <th css={tentStyle}>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('F')}>
                            F
                        </button>
                    </th>
                    <th css={tentStyle}>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('pker')}>
                            Pker
                        </button>
                    </th>
                    <th css={tentStyle}>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('done')}>
                            Done
                        </button>
                    </th>
                    <th>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('state')}>
                            Status
                        </button>
                    </th>
                    <th>
                        <button className="nisbutton2" type="button" onClick={() => requestSort('endTime')}>
                            Time
                        </button>
                    </th>
                    <th css={doneColStyle}></th>
                </tr>
                </thead>
                <tbody>{output}</tbody>
            </table>
        </div>
    );
};

export default WbTable;
