import pool from './db';
import { ViolatorDrone, ViolatorEntry } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entryMapper = (row: any): ViolatorEntry => {
	return {
		name: row['pilot_name'] as string,
		phone: row['phone_number'] as string,
		email: row['email'] as string,
		serialNumber: row['serial_number'] as string,
		closestDistance: row['closest_distance'] as number,
		lastSeen: row['last_seen'] as Date
	};
};

const checkReportEntry = async (serialNumber: string): Promise<boolean> => {
	const query = {
		text: `select * 
				from pilots 
				where serial_number = $1`,
		values: [serialNumber]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const updatePilots = async () => {
	const query = {
		text: `update pilots 
				set closest_distance=subquery.distance,
					last_seen=subquery.last_seen
				from (select serial_number, min(d.distance) as distance, max(d.captured_at) as last_seen
					from drone_position_entries d
					where d.captured_at >= now() - interval '10 minutes'
					group by serial_number) as subquery
				where pilots.serial_number = subquery.serial_number;`,
		values: []
	};
	await pool.query(query);
};

const addPostitonEntries = async (positionData: ViolatorDrone, capturedAt: Date) => {
	const { serialNumber, positionX, positionY, distance } = positionData;
	const query = {
		text: `insert into drone_position_entries
					(serial_number,
					position_x,
					position_y,
					distance,
					captured_at) 
				values($1, $2, $3, $4, $5)`,
		values: [serialNumber, positionX, positionY, distance, capturedAt]
	};
	await pool.query(query);
};

const addNewPilot = async (violatorEntry: ViolatorEntry) => {
	const query = {
		text: `insert into pilots
					(pilot_name,
					phone_number,
					email,
					serial_number,
					last_seen,
					closest_distance) 
				values($1, $2, $3, $4, $5, $6)
				on conflict do nothing`,
		values: [
			violatorEntry.name,
			violatorEntry.phone,
			violatorEntry.email,
			violatorEntry.serialNumber,
			violatorEntry.lastSeen,
			violatorEntry.closestDistance
		]
	};
	await pool.query(query);
};

const getViolators = async (): Promise<ViolatorEntry[]> => {
	const query = {
		text: `select *
				from pilots 
				where last_seen >= now() - interval '10 minutes' 
				order by last_seen desc`
	};
	const res = await pool.query(query);
	return res.rows.map(entryMapper);
};

const clearExpiredEntries = async () => {
	const query = {
		text: `delete
				from pilots
				where last_seen <= now() - interval '10 minutes'`
	};
	await pool.query(query);
};

export { checkReportEntry, updatePilots, addPostitonEntries, addNewPilot, getViolators, clearExpiredEntries };
