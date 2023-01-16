export type Violator = {
	name: string | undefined;
	phone: string | undefined;
	email: string | undefined;
	serialNumber: string;
	closestDistance: number;
	lastSeen: Date;
	lastSeenPositionX: number;
	lastSeenPositionY: number;
};
