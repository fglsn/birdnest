import { NestPosition, Coordinates, ParsedReport, ViolatorDrone } from "./types";

const nestPosition: NestPosition = { x: 250000, y: 250000 };

export const euclideanDistance = (p1: NestPosition, p2: Coordinates): number => {
	const xDiff = p2.x - p1.x;
	const yDiff = p2.y - p1.y;
	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

export const getViolators = (report: ParsedReport): ViolatorDrone[] => {
	const violators = report.drones.map((drone) => {
		const dronePosition = { x: drone.positionX, y: drone.positionY };
		const distance = euclideanDistance(nestPosition, dronePosition);
		if (distance <= 100000) return { ...drone, distance };
		return;
	});
	const res = violators.filter((elem) => elem !== undefined);
	if (res && res.length) return res as ViolatorDrone[];
	return [];
};
