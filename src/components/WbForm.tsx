/** @jsx jsx */
import React, {useEffect, useRef, useState} from 'react';
import { useDispatch } from 'react-redux';
import { logCampLine, reset } from '../store/actions';
import {css, jsx} from '@emotion/react'

const formStyle = css`
	display: flex;
`;
const inputStyle = css`
	flex: 1;
	height: 25px;
`;

interface Props {}

const WbForm: React.FC<Props> = () => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState<string>('');
	let inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let focusFunc = () => {
			// FIXME: This break tabbing
			inputRef.current?.focus();
		};
		document.addEventListener('keydown', focusFunc);
		return () => {
			document.removeEventListener('keydown', focusFunc);
		}
	});

	const handleSubmit: React.FormEventHandler = (event) => {
		event.preventDefault()
		dispatch(logCampLine(message));;
		setMessage('');
	};;

	let onReset = () => {
		if (!confirm('Clear all data in the form?')) { // eslint-disable-line
			return;
		}
		dispatch(reset());
	}

	return (
		<div>
			<form css={formStyle} onSubmit={handleSubmit}>
				<input
						name="message"
						type="text"
						className="nisinput"
						css={inputStyle}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						ref={inputRef}
						autoFocus
					/>
				<button type="submit" className="nisbutton2">Submit</button>
				<button type="button" className="nisbutton2" onClick={onReset}> Reset</button>
			</form>
		</div>
	);
};

export default WbForm;
