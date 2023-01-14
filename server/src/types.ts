export type DroneData = {
	positionX: number;
	positionY: number;
	serialNumber: string;
};

export type ParsedReport = {
	snapshotTimestamp: Date;
	drones: DroneData[];
};

export type Coordinates = {
	x: number;
	y: number;
};

export type ViolatorDrone = DroneData & { distance: number };

export type Pilot = {
	pilotId: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	createdDt: string;
};

export type ViolatorEntry = {
	name: string;
	phone: string;
	email: string;
	serialNumber: string;
	closestDistance: number;
	lastSeen: Date;
};
