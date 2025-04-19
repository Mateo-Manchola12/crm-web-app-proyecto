const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGSESSIONS, PGAPP } = process.env

export const DB_HOST = PGHOST as string
export const DB_PORT = Number(PGPORT) as number
export const DB_USER = PGUSER as string
export const DB_PASSWORD = PGPASSWORD

export const DB_SESSIONS_NAME = PGSESSIONS as string
export const DB_APP_NAME = PGAPP as string
