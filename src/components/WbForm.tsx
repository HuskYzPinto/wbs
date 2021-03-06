import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logCampLine, reset } from '../store/actions';

interface Props {}

const WbForm: React.FC<Props> = () => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState<string>('');
	return (
		<div>
			<input
				name="message"
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<br />
			<button onClick={() => dispatch(logCampLine(message))}>Submit</button>
			<br />
			<button onClick={() => dispatch(reset())}> Reset</button>
		</div>
	);
};

export default WbForm;
