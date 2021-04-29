import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { done } from '../store/actions';
import { WarbandInfo, Tent } from '../libs/parser';
import { Camp } from '../store/type';

type SortKeyer = (camp: Camp) => any;
type SortKey = keyof Camp | Tent;
enum SortDirection {
	Ascending = 0,
	Descending = 1,
}
interface Props {}

const sortKeyer: { readonly [key in SortKey]?: SortKeyer } = {
	world: (c) => c.world,
	location: (c) => c.location,
	done: (c) => (c.done ? 0 : 1),
	pker: (c) => (c.pker ? 0 : 1),
	state: (c) => c.state,
	C: (c) => (c.tents?.includes('C') ? 0 : 1),
	S: (c) => (c.tents?.includes('S') ? 0 : 1),
	H: (c) => (c.tents?.includes('H') ? 0 : 1),
	M: (c) => (c.tents?.includes('M') ? 0 : 1),
	F: (c) => (c.tents?.includes('F') ? 0 : 1),
};

const WbTable: React.FC<Props> = (props: any) => {
	const state = useSelector((state) => state.camps);
	const dispatch = useDispatch();

	const camps: Camp[] = state;
	const [sortConfig, setSortConfig] = React.useState<{
		key: SortKey;
		direction: SortDirection;
	} | null>(null);

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
		setSortConfig({ key, direction });
	};

	let sortedCamps: Camp[] = [...camps];

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
							<button type="button" onClick={() => requestSort('C')}>
								Construction
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('S')}>
								Smithing
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('M')}>
								Mining
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('H')}>
								Herblore
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('F')}>
								Farming
							</button>
						</th>
						<th>
							<button type="button" onClick={() => requestSort('state')}>
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
