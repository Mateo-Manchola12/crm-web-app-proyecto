export const DB_HOST = process.env.PGHOST as string
export const DB_PORT = Number(process.env.PGPORT) as number
export const DB_USER = process.env.PGUSER as string
export const DB_PASSWORD = process.env.PGPASSWORD

export const DB_SESSIONS_NAME = process.env.PGSESSIONS as string
export const DB_APP_NAME = process.env.PGAPP as string
