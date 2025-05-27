const { NODE_ENV, PORT, HOST } = process.env;

export const ENVIRONMENT = NODE_ENV as string;
export const SERVER_PORT = Number(PORT);
export const SERVER_HOST = HOST as string;
