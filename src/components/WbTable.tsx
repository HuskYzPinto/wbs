import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

interface Props {}

const WbTable: React.FC<Props> = () => {
	const state = useSelector((state) => state.camps);

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
				</thead>
				<tr>
					<td>hello</td>
				</tr>
			</table>
		</div>
	);
};

export default WbTable;
