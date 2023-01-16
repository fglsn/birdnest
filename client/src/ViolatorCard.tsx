import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { Container, Card, CardContent, Box, Typography } from '@mui/material';
import { Violator } from './types';
import CurrentPosition from './CurrentPosition';

export const StyledContainer = styled(Container)({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	textAlign: 'center'
});

const StyledCard = styled(Card)({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	textAlign: 'center',
	alignItems: 'center',
	backgroundColor: '#ffffffe3'
});

const StyledCardContent = styled(CardContent)({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	justifyContent: 'space-evenly',
	width: '50%'
});

const ViolatorCard = ({ violator }: { violator: Violator }) => {
	const date = new Date(violator.lastSeen);
	const lastSeenTime = dayjs(date.toISOString()).format('HH:mm');

	return (
		<StyledContainer>
			<StyledCard sx={{ flexDirection: { sm: 'column', md: 'row' } }}>
				<StyledCardContent>
					<Box>
						<Typography variant="h5" component="div">
							{violator.name}
						</Typography>
						<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
							{violator.email} <br />
						</Typography>
						<Typography sx={{ mb: 1.5 }} color="text.secondary">
							{violator.phone}
						</Typography>
					</Box>
					<Box>
						<Typography variant="body2">
							Closest violation:{' '}
							<Typography>
								{Math.floor(violator.closestDistance / 1000)}m <br />
							</Typography>
						</Typography>
					</Box>
				</StyledCardContent>
				<StyledCardContent>
					<Typography>Latest position: </Typography>
					<CurrentPosition
						{...{ x: violator.lastSeenPositionX, y: violator.lastSeenPositionY }}
					></CurrentPosition>
					<Typography variant="body2">
						Captured {`${dayjs(date.toISOString()).fromNow()}`}
						<br />
						at {lastSeenTime}
					</Typography>
				</StyledCardContent>
			</StyledCard>
		</StyledContainer>
	);
};

export default ViolatorCard;
