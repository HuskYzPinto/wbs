import React, { useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { logCampLine, reset } from '../store/actions';

interface Props {}

const WbForm: React.FC<Props> = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState<string>('');
    return (
        <div>
            <input
                name='message'
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={() => dispatch(logCampLine(message))}>
                Submit
            </button>
        </div>
    );
};

export default WbForm;
