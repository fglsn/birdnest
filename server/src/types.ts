import * as t from 'io-ts';

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

export const PilotSchema = t.type({
	pilotId: t.string,
	firstName: t.string,
	lastName: t.string,
	phoneNumber: t.string,
	createdDt: t.string,
	email: t.string
});

export type Pilot = t.TypeOf<typeof PilotSchema>;

export type ViolatorEntry = {
	name: string | undefined;
	phone: string | undefined;
	email: string | undefined;
	serialNumber: string;
	closestDistance: number;
	lastSeen: Date;
};
