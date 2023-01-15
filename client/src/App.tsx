// import './App.css';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Violator } from './types';

const App = () => {
	const [violators, setViolators] = useState<Violator[]>([]);

	useEffect(() => {
		const getViolators = async () => {
			try {
				const response = await axios.get<Violator[]>(`http://localhost:3001/report`);
				setViolators(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		const interval = setInterval(() => {
			getViolators();
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			{violators.map((violator, i) => {
				return <div key={violator.serialNumber}>{i + 1 + ': ' + violator.name}</div>;
			})}
		</>
	);
};

export default App;
