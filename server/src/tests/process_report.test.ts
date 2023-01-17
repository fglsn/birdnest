import { describe, expect } from '@jest/globals';
import { clearViolators, noViolators, pilot, report, secondReport } from './test_helper';
import { processDroneReport } from '../processReport';
import { getViolators } from '../queries';
import { getPilotData } from '../getPilotData';

import * as dotenv from 'dotenv';
import { parseReport } from '../getReport';
dotenv.config();

jest.setTimeout(10000);
jest.mock('../getPilotData');

export const requestPilotDataMock = jest.mocked(getPilotData);
export const secondRequestPilotDataMock = jest.mocked(getPilotData);

describe('test process report functionality', () => {
	beforeEach(async () => {
		await clearViolators();
	});

	test('new violators are added', async () => {
		const initialResponse = await getViolators();
		expect(initialResponse.length).toEqual(0);

		const parsedReport = parseReport(report);
		requestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(parsedReport);

		const result = await getViolators();
		expect(result.length).toEqual(1);
		expect(result[0].serialNumber).toEqual(pilot.pilotId);
		expect(result[0].email).toEqual(pilot.email);
	});

	test('not violators are not added', async () => {
		const initialResponse = await getViolators();
		expect(initialResponse.length).toEqual(0);

		const parsedReport = parseReport(noViolators);
		await processDroneReport(parsedReport);

		const result = await getViolators();
		expect(result.length).toEqual(0);
	});

	test('new violator with empty data added when failed to load pilot', async () => {
		const initialResponse = await getViolators();
		expect(initialResponse.length).toEqual(0);

		const parsedReport = parseReport(report);
		requestPilotDataMock.mockReturnValue(Promise.resolve(undefined));
		await processDroneReport(parsedReport);

		await processDroneReport(parsedReport);
		const result = await getViolators();
		expect(result.length).toEqual(1);

		expect(result[0].serialNumber).toEqual(pilot.pilotId);
		expect(result[0].name).toBe(null);
		expect(result[0].phone).toBe(null);
		expect(result[0].email).toBe(null);
	});

	test('violator data is set after another but successful pilot data fetch', async () => {
		const initialResponse = await getViolators();
		expect(initialResponse.length).toEqual(0);

		const initialParsedReport = parseReport(report);
		requestPilotDataMock.mockReturnValue(Promise.resolve(undefined));
		await processDroneReport(initialParsedReport);

		await processDroneReport(initialParsedReport);
		const firstResult = await getViolators();
		expect(firstResult.length).toEqual(1);

		expect(firstResult[0].serialNumber).toEqual(pilot.pilotId);
		expect(firstResult[0].name).toBe(null);
		expect(firstResult[0].phone).toBe(null);
		expect(firstResult[0].email).toBe(null);

		const parsedReport = parseReport(report);
		secondRequestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(parsedReport);

		await processDroneReport(initialParsedReport);
		const result = await getViolators();
		expect(result.length).toEqual(1);

		expect(result[0].serialNumber).toEqual(pilot.pilotId);
		expect(result[0].name).toEqual(pilot.firstName + ' ' + pilot.lastName);
		expect(result[0].phone).toBe(pilot.phoneNumber);
		expect(result[0].email).toBe(pilot.email);
	});

	test('latest position of existing violator is updated', async () => {
		const initialParsedReport = parseReport(report);
		requestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(initialParsedReport);

		const firstResult = await getViolators();
		expect(firstResult.length).toEqual(1);
		const positionAtStart = { x: firstResult[0].lastSeenPositionX, y: firstResult[0].lastSeenPositionY };

		const parsedReport = parseReport(secondReport);
		secondRequestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(parsedReport);

		const result = await getViolators();
		expect(result.length).toEqual(1);
		const positionAtEnd = { x: result[0].lastSeenPositionX, y: result[0].lastSeenPositionY };
		// console.log(positionAtStart);
		// console.log(positionAtEnd);
		expect(positionAtStart).not.toEqual(positionAtEnd);
	});

	test('closest distance is updated if drone flew closer', async () => {
		const initialParsedReport = parseReport(report);
		requestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(initialParsedReport);

		const firstResult = await getViolators();
		expect(firstResult.length).toEqual(1);
		const distanceAtStart = firstResult[0].closestDistance;

		const parsedReport = parseReport(secondReport);
		secondRequestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(parsedReport);

		const result = await getViolators();
		expect(result.length).toEqual(1);
		const distanceAtEnd = result[0].closestDistance;
		// console.log(distanceAtStart);
		// console.log(distanceAtEnd);
		expect(distanceAtStart).not.toEqual(distanceAtEnd);
	});

	test('closest distance is NOT updated if drone flew away', async () => {
		const parsedReport = parseReport(secondReport);
		secondRequestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(parsedReport);

		const firstResult = await getViolators();
		expect(firstResult.length).toEqual(1);
		const distanceAtStart = firstResult[0].closestDistance;

		const initialParsedReport = parseReport(report);
		requestPilotDataMock.mockReturnValue(Promise.resolve(pilot));
		await processDroneReport(initialParsedReport);

		const result = await getViolators();
		expect(result.length).toEqual(1);
		const distanceAtEnd = result[0].closestDistance;
		// console.log(distanceAtStart);
		// console.log(distanceAtEnd);
		expect(distanceAtStart).toEqual(distanceAtEnd);
	});
});
