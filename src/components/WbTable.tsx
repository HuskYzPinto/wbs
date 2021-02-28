import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {done} from '../store/actions';
import { WarbandInfo } from '../libs/parser';


interface Props {}




const WbTable: React.FC<Props> = () => {
	
    const state = useSelector((state) => state.camps);
	console.log(state);
	const dispatch = useDispatch();
    const output = state.map((camp) => 
        <tr>
            <td>{camp.world}</td>
            <td>{camp.location}</td>
            <td>{camp.tents}</td>
            <td>{camp.state}</td>
            <td>{camp.pker}</td>
			<td>
				<button onClick={() => {
					const info: Partial<WarbandInfo> = {world:camp.world};
					dispatch(done(info))}}>
					Done </button>
			</td>
        </tr>
    );
	return (
		<div>
			<table>
				<thead>
					<th>World</th>
					<th>Location</th>
					<th>Tents</th>
					<th>Status</th>
					<th>Pker</th>
					<th>Timer</th>
					<th>Done</th>
				</thead>
				<tbody>
                    {output}
				</tbody>
			</table>
		</div>
	);
};

export default WbTable;
