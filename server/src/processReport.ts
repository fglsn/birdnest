import axios from 'axios';
import { Coordinates, ParsedReport, ViolatorDrone, PilotSchema } from './types';
import { addNewPilot, addDronePosition, checkIfPilotExistsAndHasData, updatePilots } from './queries';
import { isRight } from 'fp-ts/lib/Either';

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

export const getNewViolators = async (violatingDrones: ViolatorDrone[]) => {
	return (
		await Promise.all(
			violatingDrones.map(async (drone) => {
				const pilotExists = await checkIfPilotExistsAndHasData(drone.serialNumber);
				return pilotExists ? [] : [drone];
			})
		)
	).flatMap((drone) => drone);
};

const getPilotData = async (serialNumber: string) => {
	try {
		const response = await axios.get<string>(`http://assignments.reaktor.com/birdnest/pilots/${serialNumber}`);
		if (!response.data) console.log('Failed to fetch pilot data from URL');

		const pilotData = PilotSchema.decode(response.data);
		if (isRight(pilotData)) {
			return pilotData.right;
		} else {
			console.log('Error parsing pilot data payload: ', pilotData.left);
			return undefined;
		}
	} catch (err) {
		console.log('Error getting pilot data: ', err);
		return undefined;
	}
};

export const addNewViolators = async (violators: ViolatorDrone[], snapshotTimestamp: Date) => {
	await Promise.all(
		violators.map(async (drone) => {
			const pilotData = await getPilotData(drone.serialNumber);
			if (!pilotData) {
				await addNewPilot({
					name: undefined,
					phone: undefined,
					email: undefined,
					serialNumber: drone.serialNumber,
					lastSeen: snapshotTimestamp,
					closestDistance: drone.distance
				});
			} else {
				const pilotContacts = {
					name: pilotData.firstName + ' ' + pilotData.lastName,
					phone: pilotData.phoneNumber,
					email: pilotData.email
				};

				await addNewPilot({
					...pilotContacts,
					serialNumber: drone.serialNumber,
					lastSeen: snapshotTimestamp,
					closestDistance: drone.distance
				});
			}
		})
	);
};

export const processDroneReport = async (parsedReport: ParsedReport) => {
	const captureTime = parsedReport.snapshotTimestamp;
	const violatingDrones = getViolatingDrones(parsedReport);

	const newViolators = await getNewViolators(violatingDrones);
	await addNewViolators(newViolators, captureTime);

	await Promise.all(violatingDrones.map(async (drone) => await addDronePosition(drone, captureTime)));
	await updatePilots();
};
