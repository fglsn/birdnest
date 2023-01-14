import pool from './db';
import { ViolatorDrone, ViolatorEntry } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entryMapper = (row: any): ViolatorEntry => {
	return {
		name: row['pilot_name'] as string,
		phone: row['phone_number'] as string,
		email: row['email'] as string,
		serialNumber: row['serial_number'] as string,
		positionX: row['position_x'] as number,
		positionY: row['position_y'] as number,
		distance: row['distance'] as number,
		lastSeen: row['last_seen'] as Date
	};
};

const checkReportEntry = async (serialNumber: string): Promise<boolean> => {
	const query = {
		text: `select * 
				from violator_entries 
				where serial_number = $1`,
		values: [serialNumber]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const updateExistingRecord = async (drone: ViolatorDrone, snapshotTimestamp: Date) => {
	const query = {
		text: `update violator_entries 
				set distance = $1, 
					position_x = $2, 
					position_y = $3, 
					last_seen = $4 
				where serial_number = $5 and distance > $1`,
		values: [drone.distance, drone.positionX, drone.positionY, snapshotTimestamp, drone.serialNumber]
	};
	await pool.query(query);
};

const addNewEntry = async (violatorEntry: ViolatorEntry) => {
	const query = {
		text: `insert into violator_entries
					(pilot_name,
					phone_number,
					email,
					serial_number,
					position_x,
					position_y,
					distance,
					last_seen) 
				values($1, $2, $3, $4, $5, $6, $7, $8)
				on conflict do nothing`,
		values: [
			violatorEntry.name,
			violatorEntry.phone,
			violatorEntry.email,
			violatorEntry.serialNumber,
			violatorEntry.positionX,
			violatorEntry.positionY,
			violatorEntry.distance,
			violatorEntry.lastSeen
		]
	};
	await pool.query(query);
};

const getViolators = async (): Promise<ViolatorEntry[]> => {
	const query = {
		text: `select *
				from violator_entries 
				where last_seen >= now() - interval '10 minutes' 
				order by last_seen desc`
	};
	const res = await pool.query(query);
	return res.rows.map(entryMapper);
};

export { checkReportEntry, updateExistingRecord, addNewEntry, getViolators };
