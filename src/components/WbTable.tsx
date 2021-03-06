import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { done } from '../store/actions';
import { WarbandInfo } from '../libs/parser';
import { Camp } from '../store/type';

interface Props {}

const WbTable: React.FC<Props> = () => {
	const state = useSelector((state) => state.camps);
	const dispatch = useDispatch();

	const camps: Array<Camp> = state;
	const [sortConfig, setSortConfig] = React.useState<any>(null);

	const requestSort = (key: string) => {
		let direction = 'ascending';
		if (sortConfig) {
			if (sortConfig.key === key && sortConfig.direction === 'ascending') {
				direction = 'descending';
			}
		}
		setSortConfig({ key, direction });
	};

	let sortedCamps: any = [...camps];

	if (sortConfig !== null) {
		sortedCamps.sort((a: any, b: any) => {
			if (a[sortConfig.key!] < b[sortConfig.key!]) {
				return sortConfig.direction === 'ascending' ? -1 : 1;
			}
			if (a[sortConfig.key!] > b[sortConfig.key!]) {
				return sortConfig.direction === 'ascending' ? 1 : -1;
			}
			return 0;
		});
	}

	const checkBool = (info: boolean | null) => {
		if (info) {
			return 'Yes';
		} else {
			return 'No';
		}
	};

	const checkTent = (tents: Array<string> | null, skill: string) => {
		if (tents) {
			return tents.includes(skill);
		} else {
			return null;
		}
	};

	const output = sortedCamps.map((camp: any) => (
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
				<button
					onClick={() => {
						const info: Partial<WarbandInfo> = { world: camp.world };
						dispatch(done(info));
					}}>
					Done{' '}
				</button>
			</td>
		</tr>
	));
	return (
		<div>
			<table>
				<caption> Warband Application</caption>
				<thead>
					<tr>
						<th>
							<button type="button" onClick={() => requestSort('world')}>
								World
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('location')}>
								Location
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('construction')}>
								Construction
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('smithing')}>
								Smithing
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('mining')}>
								Mining
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('herblore')}>
								Herblore
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('farming')}>
								Farming
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('status')}>
								Status
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('pker')}>
								Pker
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('done')}>
								Done
							</button>
						</th>
					</tr>
				</thead>
				<tbody>{output}</tbody>
			</table>
		</div>
	);
};

export default WbTable;
