import { app, updatePilotsState } from './app';
import { setIntervalAsync } from 'set-interval-async';
import { clearExpiredEntries } from './queries';

const PORT = 3001;

setIntervalAsync(async () => {
	try {
		console.log(new Date().toUTCString(), 'Fetching report, updating pilots state.');
		await updatePilotsState();

		console.log('Clearing expired pilot entries.');
		await clearExpiredEntries();
	} catch (err) {
		console.log('Error occured in the backgroud: ', err);
	}
}, 2000);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
