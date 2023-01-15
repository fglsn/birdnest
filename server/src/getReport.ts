import axios from 'axios';
import { Element, xml2js } from 'xml-js';
import { DroneData, ParsedReport } from './types';

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const getElementsByName = (element: Element[], name: string): Element[] | undefined => {
	return element.filter((element) => element.name === name);
};

const getTextFieldValue = (drone: Element, field: string): string => {
	const elements = getElementsByName(drone.elements || [], field);
	if (!elements || !elements.length) throw new Error(`Missing value for the ${field} field.`);

	const value = elements[0].elements?.[0].text;
	if (!isString(value)) throw new Error(`Expected value to be string, got ${typeof value}.`);
	return value;
};

const parseDrone = (droneElements: Element): DroneData => {
	const serialNumber = getTextFieldValue(droneElements, 'serialNumber');
	const positionX = getTextFieldValue(droneElements, 'positionX');
	const positionY = getTextFieldValue(droneElements, 'positionY');
	return { serialNumber, positionX: Number(positionX), positionY: Number(positionY) };
};

const parseReport = (reportPayload: string): ParsedReport => {
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
	if (!snapshotTimestamp || !isString(snapshotTimestamp)) throw new Error('Missing timestamp.');

	const droneElements = capture[0].elements || [];

	const drones = droneElements.flatMap((e) => {
		if (!e) throw new Error('Missing drones data');
		const drone = parseDrone(e);
		return drone;
	});

	return { snapshotTimestamp: new Date(snapshotTimestamp), drones };
};

export const getReport = async (): Promise<ParsedReport> => {
	const response = await axios.get<string>('http://assignments.reaktor.com/birdnest/drones');
	if (!response || !response.data) throw new Error('Failed to load XML report.');
	return parseReport(response.data);
};
