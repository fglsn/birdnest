import pool from './db';
import { DroneData, ViolatorDrone, ViolatorEntry } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entryMapper = (row: any): ViolatorEntry => {
	return {
		name: row['pilot_name'] as string,
		phone: row['phone_number'] as string,
		email: row['email'] as string,
		serialNumber: row['serial_number'] as string,
		closestDistance: row['closest_distance'] as number,
		lastSeen: row['last_seen'] as Date,
		lastSeenPositionX: row['last_seen_position_x'] as number,
		lastSeenPositionY: row['last_seen_position_y'] as number
	};
};

const checkIfPilotExistsAndHasData = async (serialNumber: string): Promise<boolean> => {
	const query = {
		text: `select * 
				from violators 
				where serial_number = $1 
					and pilot_name is not null 
					and phone_number is not null 
					and email is not null`,
		values: [serialNumber]
	};
	const res = await pool.query(query);
	if (!res.rowCount) {
		return false;
	}
	return true;
};

const updateClosestDistances = async () => {
	const query = {
		text: `update violators 
				set closest_distance=subquery.distance
				from (select serial_number, min(d.distance) as distance, max(d.captured_at) as last_seen
					from drone_positions d
					where d.captured_at >= now() - interval '10 minutes'
					group by serial_number) as subquery
				where violators.serial_number = subquery.serial_number;`,
		values: []
	};
	await pool.query(query);
};

const updateLatestPosition = async (positionData: DroneData, capturedAt: Date) => {
	const { serialNumber, positionX, positionY } = positionData;
	const query = {
		text: `update violators 
				set last_seen = $1,
					last_seen_position_x = $2,
					last_seen_position_y = $3
				where violators.serial_number = $4`,
		values: [capturedAt, positionX, positionY, serialNumber]
	};
	await pool.query(query);
};

const addDronePosition = async (positionData: ViolatorDrone, capturedAt: Date) => {
	const { serialNumber, positionX, positionY, distance } = positionData;
	const query = {
		text: `insert into drone_positions
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
		text: `insert into violators
					(pilot_name,
					phone_number,
					email,
					serial_number,
					last_seen,
					closest_distance,
					last_seen_position_x,
					last_seen_position_y) 
				values($1, $2, $3, $4, $5, $6, $7, $8)
				on conflict (serial_number)
				do update set
						pilot_name = $1,
						phone_number = $2,
						email = $3,
						last_seen = $5,
						closest_distance = $6,
						last_seen_position_x = $7,
						last_seen_position_y = $8
					`,
		values: [
			violatorEntry.name,
			violatorEntry.phone,
			violatorEntry.email,
			violatorEntry.serialNumber,
			violatorEntry.lastSeen,
			violatorEntry.closestDistance,
			violatorEntry.lastSeenPositionX,
			violatorEntry.lastSeenPositionY
		]
	};
	await pool.query(query);
};

const getViolators = async (): Promise<ViolatorEntry[]> => {
	const query = {
		text: `select *
				from violators 
				where last_seen >= now() - interval '10 minutes' 
				order by last_seen desc`
	};
	const res = await pool.query(query);
	return res.rows.map(entryMapper);
};

const clearExpiredEntries = async () => {
	const query = {
		text: `delete
				from violators
				where last_seen < now() - interval '10 minutes'`
	};
	await pool.query(query);
};

export {
	checkIfPilotExistsAndHasData,
	updateClosestDistances,
	updateLatestPosition,
	addDronePosition,
	addNewPilot,
	getViolators,
	clearExpiredEntries
};
