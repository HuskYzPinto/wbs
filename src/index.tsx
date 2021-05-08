import React, { useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import createStore from './store/store';
import ReactDOM from 'react-dom';

import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import readChatbox from "./alt1";

const store = createStore();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

readChatbox(store);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
