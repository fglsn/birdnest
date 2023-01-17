import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { Violator } from './types';
import { Typography, Container } from '@mui/material';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import CircularProgress from '@mui/material/CircularProgress';
import ViolatorCard, { StyledContainer } from './components/ViolatorCard';
import Footer from './components/Footer';

dayjs.extend(relativeTime);

const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

const App = () => {
	const [violators, setViolators] = useState<Violator[] | undefined>(undefined);

	useEffect(() => {
		const getViolators = async () => {
			try {
				const response = await axios.get<Violator[]>(`${baseUrl}/report`);
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

	const handleClick = () => window.scrollTo(0, 0);

	const mostFlagrantViolatior =
		violators &&
		violators.reduce((previous, current) => {
			return current.closestDistance < previous.closestDistance ? current : previous;
		});
	return (
		<StyledContainer maxWidth="md">
			<Typography sx={{ fontWeight: '700', fontSize: '3rem' }} color={'#d88787'} mt={5}>
				NDZ Violators
			</Typography>
			<Typography sx={{ fontWeight: '400', fontSize: '2rem' }} color={'#524f4f'} mb={3}>
				Records for the past 10 minutes
			</Typography>
			{mostFlagrantViolatior && (
				<Typography fontSize={18}>
					The most severe violation was detected at a distance of{' '}
					{Math.round(mostFlagrantViolatior.closestDistance) / 1000} meters from the
					nest
				</Typography>
			)}
			{violators ? (
				violators.length ? (
					violators.map((violator, i) => {
						return (
							<StyledContainer sx={{ padding: 2 }} key={violator.serialNumber}>
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
			<Container>
				<ArrowCircleUpRoundedIcon
					fontSize={'large'}
					sx={{ margin: 2, color: '#d88787' }}
					onClick={handleClick}
				/>
			</Container>
			<Footer />
		</StyledContainer>
	);
};

export default App;
