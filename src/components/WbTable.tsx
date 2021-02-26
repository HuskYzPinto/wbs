import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';



interface Props {}




const WbTable: React.FC<Props> = () => {
	
    const state = useSelector((state) => state.camps);
    const output = state.map((camp) => 
        <tr>
            <td>{camp.world}</td>
            <td>{camp.location}</td>
            <td>{camp.tents}</td>
            <td>{camp.state}</td>
            <td>{camp.pker}</td>
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
				</thead>
				<tr>
                    {output}
				</tr>
			</table>
		</div>
	);
};

export default WbTable;
