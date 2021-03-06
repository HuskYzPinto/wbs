import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { done } from '../store/actions';
import { WarbandInfo } from '../libs/parser';
import {Camp} from '../store/type';


interface Props {}


const WbTable: React.FC<Props> = () => {
	
    const state = useSelector((state) => state.camps);
	const dispatch = useDispatch();

	const camps:Array<Camp> = state;
	const [sortedField, setSortedField] = React.useState<any|null>(null);
	
	let sortedCamps:any = [...camps];

	

	if (sortedField !== null){
		sortedCamps.sort((a:any,b:any) => {
		if (a[sortedField!] < b[sortedField!]){
			return -1;
		}
		if (a[sortedField!] > b[sortedField!]){
			return 1;
		}
		return 0
		});
	}
	

	
	const checkBool = (info: boolean|null)=>{
		if (info){
			return 'Yes';
		} else{
			return 'No';
		}
	}

	const checkTent = (tents: Array<string>|null, skill: string)=>{
		if (tents){
			return tents.includes(skill);
		} else {
			return null
		}
	}


    const output = sortedCamps.map((camp:any) => 
        <tr key={camp.world}>
            <td>{camp.world}</td>
            <td>{camp.location}</td>
			<td>{checkBool(checkTent(camp.tents, 'C'))}</td>
			<td>{checkBool(checkTent(camp.tents, 'S'))}</td>
			<td>{checkBool(checkTent(camp.tents, 'M'))}</td>
			<td>{checkBool(checkTent(camp.tents, 'H'))}</td>
			<td>{checkBool(checkTent(camp.tents, 'F'))}</td>
            <td>{camp.state}</td>
            <td>{checkBool(camp.pker)}</td>
			<td>{checkBool(camp.done)}</td>
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
				<caption> Warband Application</caption>
				<thead>
					<tr>
						<th>
							<button type="button" onClick={() =>setSortedField('world')}>World</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('location')}>Location</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('construction')}>Construction</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('smithing')}>Smithing</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('mining')}>Mining</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('herblore')}>Herblore</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('farming')}>Farming</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('status')}>Status</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('pker')}>Pker</button>
						</th>
						<th>
							<button type="button" onClick={() => setSortedField('done')}>Done</button>
						</th>
					</tr>
				</thead>
				<tbody>
                    {output}
				</tbody>
			</table>
		</div>
	);
};

export default WbTable;
