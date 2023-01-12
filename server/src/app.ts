import asyncHandler from 'express-async-handler';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

import { Element, xml2js } from 'xml-js';
import { DroneData } from './types';

export const app = express();

app.use(express.json({ limit: '50mb' }));

app.use(cors());

dotenv.config();

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const getElementsByName = (element: Element[], name: string): Element[] | undefined => {
	return element.filter((element) => element.name === name);
};

const getTextFieldValue = (drone: Element, field: string): string => {
	const elements = getElementsByName(drone.elements || [], field);
	if (!elements || !elements.length)
		throw new Error(`Missing value for the ${field} field.`);

	const value = elements[0].elements?.[0].text;
	if (!isString(value))
		throw new Error(`Expected value to be string, got ${typeof value}.`);
	return value;
};

const parseDrone = (droneElements: Element): DroneData => {
	const serialNumber = getTextFieldValue(droneElements, 'serialNumber');
	const positionX = getTextFieldValue(droneElements, 'positionX');
	const positionY = getTextFieldValue(droneElements, 'positionY');
	return { serialNumber, positionX: Number(positionX), positionY: Number(positionY) };
};

const parseReport = (reportPayload: string) => {
	const convertedPayload = xml2js(reportPayload) as Element;

	const report = convertedPayload.elements;
	if (!report || !report.length) throw new Error('Empty or missing report.');

	const captureElement = report.flatMap((e) => {
		if (!e.elements) return [];
		return getElementsByName(e.elements, 'capture') || [];
	});

	const capture = getElementsByName(captureElement, 'capture');
	if (!capture || !capture.length) throw new Error('Missing capture data.');

	const snapshotTimestamp = capture[0].attributes?.snapshotTimestamp;
	if (!snapshotTimestamp || !isString(snapshotTimestamp))
		throw new Error('Missing timestamp.');

	const droneElements = capture[0].elements || [];

	const drones = droneElements.flatMap((e) => {
		if (!e) throw new Error('Missing drones data');
		const drone = parseDrone(e);
		return drone;
	});

	return { snapshotTimestamp, drones };
};

app.get(
	'/capture',
	asyncHandler(async (_req, res) => {
		try {
			const response = await axios.get(
				'http://assignments.reaktor.com/birdnest/drones'
			);
			const parsedReport = parseReport(response.data as string);
			res.status(200).json(parsedReport);
		} catch (err) {
			console.log(err);
		}
	})
);

// app.use(globalErrorHandler);

// app.use(unknownEndpoint);
