import axios from 'axios';

import { Coordinates, ParsedReport, ViolatorDrone, Pilot } from './types';
import { addNewEntry, checkReportEntry, updateExistingRecord } from './queries';

const nestPosition: Coordinates = { x: 250000, y: 250000 };

export const euclideanDistance = (p1: Coordinates, p2: Coordinates): number => {
	const xDiff = p2.x - p1.x;
	const yDiff = p2.y - p1.y;
	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

export const findAndUpdateViolatingDrones = async (report: ParsedReport): Promise<ViolatorDrone[]> => {
	const violatingDrones = await Promise.all(
		report.drones.map(async (drone) => {
			const dronePosition = { x: drone.positionX, y: drone.positionY };
			const distance = euclideanDistance(nestPosition, dronePosition);
			if (distance <= 100000) {
				const recordExists = await checkReportEntry(drone.serialNumber);
				if (recordExists) {
					await updateExistingRecord(drone, distance, report.snapshotTimestamp);
					return;
				}
				return { ...drone, distance };
			}
			return;
		})
	);
	return violatingDrones.filter((elem) => elem !== undefined) as ViolatorDrone[];
};

const getPilotData = async (serialNumber: string) => {
	try {
		const response = await axios.get(`http://assignments.reaktor.com/birdnest/pilots/${serialNumber}`);
		if (response && response.data) return response.data as Pilot;
		return undefined;
	} catch (err) {
		console.log(err);
		throw new Error('Can not fetch pilot data');
	}
};

export const addNewViolators = async (drones: ViolatorDrone[], snapshotTimestamp: Date) => {
	await Promise.all(
		drones.map(async (drone) => {
			const pilotData = await getPilotData(drone.serialNumber);
			if (!pilotData) throw new Error('Missing pilot data');

			const pilotContacts = {
				name: pilotData.firstName + ' ' + pilotData.lastName,
				phone: pilotData.phoneNumber,
				email: pilotData.email
			};

			await addNewEntry({ ...pilotContacts, ...drone, lastSeen: snapshotTimestamp });
		})
	);
};
