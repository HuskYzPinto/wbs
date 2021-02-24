import { stringify } from 'node:querystring';
import React from 'react';
import { LabeledStatement } from 'typescript';


type WbFormProps = {
    message: string,
};

const WbForm: React.FC<WbFormProps> = ({children, message}) => (
    <div>
        <p> Test, this is the message: {message} </p>
        {children}
    </div>
);

export default WbForm;