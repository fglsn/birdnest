import axios from 'axios';

import { Coordinates, ParsedReport, ViolatorDrone, Pilot } from './types';
import { addNewEntry, checkReportEntry, updateExistingRecord } from './queries';

const nestPosition: Coordinates = { x: 250000, y: 250000 };

export const euclideanDistance = (p1: Coordinates, p2: Coordinates): number => {
	const xDiff = p2.x - p1.x;
	const yDiff = p2.y - p1.y;
	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

export const getViolatingDrones = (report: ParsedReport): ViolatorDrone[] => {
	return report.drones.flatMap((drone) => {
		const dronePosition = { x: drone.positionX, y: drone.positionY };
		const distance = euclideanDistance(nestPosition, dronePosition);

		return distance <= 100000 ? [{ ...drone, distance }] : [];
	});
};

export const filterExistingAndNotExistingViolators = async (
	violatingDrones: ViolatorDrone[]
): Promise<{ existingViolators: ViolatorDrone[]; newViolators: ViolatorDrone[] }> => {
	const newViolators: ViolatorDrone[] = [];
	const existingViolators: ViolatorDrone[] = [];

	await Promise.all(
		violatingDrones.map(async (drone) => {
			const recordExists = await checkReportEntry(drone.serialNumber);
			recordExists ? existingViolators.push(drone) : newViolators.push(drone);
		})
	);
	return { existingViolators, newViolators };
};

export const updateExistingViolators = async (existingViolators: ViolatorDrone[], lastSeen: Date) => {
	await Promise.all(
		existingViolators.map(async (violator) => {
			await updateExistingRecord(violator, lastSeen);
		})
	);
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

export const addNewViolators = async (violators: ViolatorDrone[], snapshotTimestamp: Date) => {
	await Promise.all(
		violators.map(async (drone) => {
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

export const processDroneReport = async (parsedReport: ParsedReport) => {
	const violatingDrones = getViolatingDrones(parsedReport);
	const lastSeen = parsedReport.snapshotTimestamp;
	const { existingViolators, newViolators } = await filterExistingAndNotExistingViolators(violatingDrones);
	await Promise.all([updateExistingViolators(existingViolators, lastSeen), addNewViolators(newViolators, lastSeen)]);
};
