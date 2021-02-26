import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

interface Props{
    world?: number,
    time?: number,
    pker?: boolean,
    state?: string,
    tents?: {},
}

const WbTable: React.FC<Props> = () =>{

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
    )
}

export default WbTable;