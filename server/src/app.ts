import asyncHandler from 'express-async-handler';
import express from 'express';
//import dotenv from 'dotenv';
import cors from 'cors';

import { getReport } from './getReport';
import { processDroneReport } from './processReport';
import { getViolators } from './queries';
import { NextFunction, Request, Response } from 'express';

export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());
//dotenv.config();

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
	console.log('Unexpected error: ', err);
	res.status(500).json({
		error: 'Unexpected error: ' + err
	});
};

export const unknownEndpoint = (_req: Request, res: Response) => {
	res.status(404).send({ error: 'Unknown endpoint' });
};

export const updatePilotsState = async () => {
	const report = await getReport();
	await processDroneReport(report);
};

app.get(
	'/report',
	asyncHandler(async (_req, res) => {
		const violators = await getViolators();
		res.status(200).json(violators);
	})
);

app.use(globalErrorHandler);

app.use(unknownEndpoint);
