import pool from '../db';

export const clearViolators = async () => await pool.query('delete from violators');
export const clearPositionEntries = async () => await pool.query('delete from drone_positions');

export const pilot = {
	pilotId: 'SN-9J5c68vwRM',
	firstName: 'Gaylord',
	lastName: 'Howe',
	phoneNumber: '+210081738870',
	createdDt: '2022-09-27T08:30:23.978Z',
	email: 'gaylord.howe@example.com'
};

const freshSnapshot = new Date();

export const report = `<report>
<deviceInformation deviceId="GUARDB1RD">
<listenRange>500000</listenRange>
<deviceStarted>2023-01-17T14:38:32.768Z</deviceStarted>
<uptimeSeconds>10904</uptimeSeconds>
<updateIntervalMs>2000</updateIntervalMs>
</deviceInformation>
<capture snapshotTimestamp="${freshSnapshot}">
<drone>
<serialNumber>SN-9J5c68vwRM</serialNumber>
<model>Altitude X</model>
<manufacturer>DroneGoat Inc</manufacturer>
<mac>0e:f4:d9:18:ee:c0</mac>
<ipv4>165.135.171.147</ipv4>
<ipv6>ed3d:a081:48f9:a052:fcb4:1412:1659:d7c2</ipv6>
<firmware>9.3.9</firmware>
<positionY>266049.8171521297</positionY>
<positionX>181734.15351041357</positionX>
<altitude>4089.622615013108</altitude>
</drone>
<drone>
<serialNumber>SN-oo1VSjBure</serialNumber>
<model>Altitude X</model>
<manufacturer>DroneGoat Inc</manufacturer>
<mac>9a:d6:c5:81:e8:55</mac>
<ipv4>204.9.93.183</ipv4>
<ipv6>773d:0d85:26cb:d030:5549:8cff:5b6c:30bd</ipv6>
<firmware>9.5.1</firmware>
<positionY>408636.06663542433</positionY>
<positionX>356784.30878680496</positionX>
<altitude>4774.186342288493</altitude>
</drone>
<drone>
<serialNumber>SN-0aypge9UWg</serialNumber>
<model>Mosquito</model>
<manufacturer>MegaBuzzer Corp</manufacturer>
<mac>f7:ef:b6:92:c7:bc</mac>
<ipv4>24.6.236.39</ipv4>
<ipv6>44a0:a387:fa5c:371c:f02a:7153:0a4d:d5e3</ipv6>
<firmware>5.0.7</firmware>
<positionY>151198.58563911862</positionY>
<positionX>287994.5819322961</positionX>
<altitude>4914.225128847325</altitude>
</drone>
</capture>
</report>`;


export const noViolators = `<report>
<deviceInformation deviceId="GUARDB1RD">
<listenRange>500000</listenRange>
<deviceStarted>2023-01-17T14:38:32.768Z</deviceStarted>
<uptimeSeconds>10904</uptimeSeconds>
<updateIntervalMs>2000</updateIntervalMs>
</deviceInformation>
<capture snapshotTimestamp="${freshSnapshot}">
<drone>
<serialNumber>SN-oo1VSjBure</serialNumber>
<model>Altitude X</model>
<manufacturer>DroneGoat Inc</manufacturer>
<mac>9a:d6:c5:81:e8:55</mac>
<ipv4>204.9.93.183</ipv4>
<ipv6>773d:0d85:26cb:d030:5549:8cff:5b6c:30bd</ipv6>
<firmware>9.5.1</firmware>
<positionY>408636.06663542433</positionY>
<positionX>356784.30878680496</positionX>
<altitude>4774.186342288493</altitude>
</drone>
<drone>
<serialNumber>SN-0aypge9UWg</serialNumber>
<model>Mosquito</model>
<manufacturer>MegaBuzzer Corp</manufacturer>
<mac>f7:ef:b6:92:c7:bc</mac>
<ipv4>24.6.236.39</ipv4>
<ipv6>44a0:a387:fa5c:371c:f02a:7153:0a4d:d5e3</ipv6>
<firmware>5.0.7</firmware>
<positionY>151198.58563911862</positionY>
<positionX>287994.5819322961</positionX>
<altitude>4914.225128847325</altitude>
</drone>
</capture>
</report>`;


export const secondReport = `<report>
<deviceInformation deviceId="GUARDB1RD">
<listenRange>500000</listenRange>
<deviceStarted>2023-01-17T14:38:32.768Z</deviceStarted>
<uptimeSeconds>10904</uptimeSeconds>
<updateIntervalMs>2000</updateIntervalMs>
</deviceInformation>
<capture snapshotTimestamp="${freshSnapshot}">
<drone>
<serialNumber>SN-9J5c68vwRM</serialNumber>
<model>Altitude X</model>
<manufacturer>DroneGoat Inc</manufacturer>
<mac>0e:f4:d9:18:ee:c0</mac>
<ipv4>165.135.171.147</ipv4>
<ipv6>ed3d:a081:48f9:a052:fcb4:1412:1659:d7c2</ipv6>
<firmware>9.3.9</firmware>
<positionY>296049.8171521297</positionY>
<positionX>201734.15351041357</positionX>
<altitude>4089.622615013108</altitude>
</drone>
<drone>
<serialNumber>SN-oo1VSjBure</serialNumber>
<model>Altitude X</model>
<manufacturer>DroneGoat Inc</manufacturer>
<mac>9a:d6:c5:81:e8:55</mac>
<ipv4>204.9.93.183</ipv4>
<ipv6>773d:0d85:26cb:d030:5549:8cff:5b6c:30bd</ipv6>
<firmware>9.5.1</firmware>
<positionY>408636.06663542433</positionY>
<positionX>356784.30878680496</positionX>
<altitude>4774.186342288493</altitude>
</drone>
<drone>
<serialNumber>SN-0aypge9UWg</serialNumber>
<model>Mosquito</model>
<manufacturer>MegaBuzzer Corp</manufacturer>
<mac>f7:ef:b6:92:c7:bc</mac>
<ipv4>24.6.236.39</ipv4>
<ipv6>44a0:a387:fa5c:371c:f02a:7153:0a4d:d5e3</ipv6>
<firmware>5.0.7</firmware>
<positionY>151198.58563911862</positionY>
<positionX>287994.5819322961</positionX>
<altitude>4914.225128847325</altitude>
</drone>
</capture>
</report>`;
