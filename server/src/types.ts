import * as t from 'io-ts';

export type DroneData = {
	positionX: number;
	positionY: number;
	serialNumber: string;
};

export const User = t.type({
	id: t.number,
	pilot_name: t.string,
	email: t.string,
	phone_number: t.string,
	lat: t.number,
	lng: t.number,
	min_distance: t.number,
	captured_at: t.string,
	expires_at: t.string
});

export type User = t.TypeOf<typeof User>;
