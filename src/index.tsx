import React, { useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import createStore from './store/store';
import ReactDOM from 'react-dom';

import './styles/nis.css';
import './styles/darkscape/skinstyle.css';

import App from './pages/App';
import reportWebVitals from './reportWebVitals';

const store = createStore();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
