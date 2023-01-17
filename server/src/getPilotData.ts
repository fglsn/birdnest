import axios from "axios";
import { isRight } from "fp-ts/lib/Either";
import { PilotSchema } from "./types";

export const getPilotData = async (serialNumber: string) => {
	try {
		const response = await axios.get<string>(`http://assignments.reaktor.com/birdnest/pilots/${serialNumber}`);
		if (!response.data) console.error('Failed to fetch pilot data from URL');

		const pilotData = PilotSchema.decode(response.data);
		if (isRight(pilotData)) {
			return pilotData.right;
		} else {
			console.error('Error parsing pilot data payload: ', pilotData.left);
			return undefined;
		}
	} catch (err) {
		console.error('Error getting pilot data: ', err);
		return undefined;
	}
};
