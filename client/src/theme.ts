import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"'
		].join(',')
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 7,
					backgroundColor: '#fffbf5'
				}
			}
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					borderRadius: 7
				}
			}
		}
	}
});

export default theme;
