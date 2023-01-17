const DB_PORT: number = process.env.NODE_ENV === 'test' ? Number(process.env.DB_PORT_TEST) : Number(process.env.DB_PORT);

const DB_NAME: string = process.env.NODE_ENV === 'test' ? String(process.env.DB_NAME_TEST) : String(process.env.DB_NAME);

export { DB_NAME, DB_PORT };
