import { Coordinates, ParsedReport, ViolatorDrone } from './types';
import { getPilotData } from './getPilotData';
import {
	addNewPilot,
	addDronePosition,
	checkIfPilotExistsAndHasData,
	updateClosestDistances,
	updateLatestPosition
} from './queries';

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

export const addNewViolators = async (violators: ViolatorDrone[], snapshotTimestamp: Date) => {
	await Promise.all(
		violators.map(async (drone) => {
			const droneData = {
				serialNumber: drone.serialNumber,
				lastSeen: snapshotTimestamp,
				closestDistance: drone.distance,
				lastSeenPositionX: drone.positionX,
				lastSeenPositionY: drone.positionY
			};
			const pilotData = await getPilotData(drone.serialNumber);
			if (!pilotData) {
				await addNewPilot({
					name: undefined,
					phone: undefined,
					email: undefined,
					...droneData
				});
			} else {
				const pilotContacts = {
					name: pilotData.firstName + ' ' + pilotData.lastName,
					phone: pilotData.phoneNumber,
					email: pilotData.email
				};

				await addNewPilot({
					...pilotContacts,
					...droneData
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

	await Promise.all(
		violatingDrones.map(async (drone) => {
			await addDronePosition(drone, captureTime);
		})
	);

	await Promise.all(
		parsedReport.drones.map(async (drone) => {
			await updateLatestPosition(drone, captureTime);
		})
	);
	await updateClosestDistances();
};
