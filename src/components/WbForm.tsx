import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logCampLine, reset } from '../store/actions';

interface Props {}

const WbForm: React.FC<Props> = () => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState<string>('');

	const handleSubmit: React.FormEventHandler = (event) => {
		event?.preventDefault()
		dispatch(logCampLine(message));;
		setMessage('');
	};;
	return (
		<div>
			<form onSubmit={handleSubmit}> 
						<input
							name="message"
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<br />
						<button type="submit"> Submit </button>
			</form>
			<br />
			<button onClick={() => dispatch(reset())}> Reset</button>
		</div>
	);
};

export default WbForm;
