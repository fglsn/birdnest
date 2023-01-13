import asyncHandler from 'express-async-handler';
import express from 'express';
//import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

import { parseReport } from './parseReport';
import { addNewViolators, findAndUpdateViolatingDrones } from './getViolators';
import { getViolators } from './queries';
export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());
//dotenv.config();

app.get(
	'/capture',
	asyncHandler(async (_req, res) => {
		try {
			const response = await axios.get('http://assignments.reaktor.com/birdnest/drones');
			const parsedReport = parseReport(response.data as string);
			const newViolators = await findAndUpdateViolatingDrones(parsedReport);
			await addNewViolators(newViolators, parsedReport.snapshotTimestamp);
			const violators = await getViolators();
			res.status(200).json(violators);
		} catch (err) {
			console.log(err);
		}
	})
);

// app.use(globalErrorHandler);

// app.use(unknownEndpoint);
