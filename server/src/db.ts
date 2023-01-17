import { Pool } from 'pg';
import { DB_NAME, DB_PORT } from './config';

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: DB_NAME,
	password: process.env.DB_PASSWORD,
	port: DB_PORT
});

export default pool;
