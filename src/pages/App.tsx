import React from 'react';
import logo from './logo.svg';
import './App.css';
import WbForm from '../components/WbForm';
import WbTable from '../components/WbTable'

const App = () => {
	return (
		<div>
			<WbForm />
			<WbTable />
		</div>
	);
};

export default App;
