import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 7,
					backgroundColor: '#ffffffe3'
				}
			}
		}
	}
});

export default theme;
