import asyncHandler from 'express-async-handler';
import express from 'express';
//import dotenv from 'dotenv';
import cors from 'cors';

import { getReport } from './getReport';
import { processDroneReport } from './processReport';
import { getViolators } from './queries';
export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());
//dotenv.config();

export const updatePilotsState = async () => {
	const report = await getReport();
	await processDroneReport(report);
};

app.get(
	'/report',
	asyncHandler(async (_req, res) => {
		try {
			const violators = await getViolators();
			res.status(200).json(violators);
		} catch (err) {
			console.log(err);
		}
	})
);

// app.use(globalErrorHandler);

// app.use(unknownEndpoint);
