const DB_PORT: number = process.env.NODE_ENV === 'test' ? 5435 : 5434;

const DB_NAME: string = process.env.NODE_ENV === 'test' ? 'birdnest-test' : 'birdnest';

export { DB_NAME, DB_PORT };
