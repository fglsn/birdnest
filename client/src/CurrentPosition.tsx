import { Box, styled } from '@mui/material';

const dashedCircle = {
	cx: 250,
	cy: 250,
	strokeDasharray: '9,7',
	fill: 'none'
};

const StyledBox = styled(Box)({
	width: '70%',
	height: '70%',
	padding: '0.5em',
	margin: '0.5em'
});

const CurrentPosition = ({ x, y }: { x: number; y: number }) => {
	const posX = Math.floor(x / 1000);
	const posY = Math.floor(y / 1000);
	return (
		<StyledBox>
			<svg
				viewBox="0 0 500 500"
				style={{
					border: '1px solid #adadadde',
					backgroundColor: 'white',
					borderRadius: '7px'
				}}
			>
				<circle cx="250" cy="250" r="5" fill="grey" />
				<circle cx="250" cy="250" r="100" stroke="red" fill="#d92e2e24" />
				<circle cx={posX} cy={500 - posY} r="10" fill="red" />
				<circle {...dashedCircle} r="150" stroke="#adadadde" />
				<circle {...dashedCircle} r="200" stroke="#adadadde" />
				<circle {...dashedCircle} r="250" stroke="#adadadde" />
				<circle {...dashedCircle} r="300" stroke="#adadadde" />

				<line x1="0" y1="250" x2="500" y2="250" stroke="grey" />
				<line x1="250" y1="0" x2="250" y2="500" stroke="grey" />
			</svg>
		</StyledBox>
	);
};

export default CurrentPosition;
