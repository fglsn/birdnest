import { useEffect, useState } from 'react';
import { Violator } from './types';
import { Typography, Container } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ViolatorCard, { StyledContainer } from './ViolatorCard';

dayjs.extend(relativeTime);

const App = () => {
	const [violators, setViolators] = useState<Violator[] | undefined>(undefined);

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
		<StyledContainer maxWidth="md">
			<Typography sx={{ fontWeight: '700', fontSize: '3rem' }} m={5}>
				NDZ Violators
				<Typography sx={{ fontWeight: '400', fontSize: '2rem' }}>
					Records for the past 10 minutes:
				</Typography>
			</Typography>
			{violators ? (
				violators.length ? (
					violators.map((violator, i) => {
						return (
							<StyledContainer sx={{ margin: 2 }} key={violator.serialNumber}>
								<ViolatorCard violator={violator} />
							</StyledContainer>
						);
					})
				) : (
					<Container>
						<Typography variant="h3">No data yet</Typography>
					</Container>
				)
			) : (
				<Container>
					<CircularProgress />
				</Container>
			)}
		</StyledContainer>
	);
};

export default App;
