import { DB_APP_NAME, DB_SESSIONS_NAME } from '#constants/db'
import { createDatabaseConnection } from '#utils/dbConnection'
import { Sql } from 'postgres'

/**
 * Establece las conexiones con las base de datos utilizando el nombre de la base de datos
 * especificado en las constantes `DB_SESSIONS_NAME` y `DB_APP_NAME.
 *
 * @constant
 * @type {Sql}
 * @description Esta conexión se utiliza para interactuar con las sesiones almacenadas
 * en la base de datos.
 */
export const db_app = createDatabaseConnection({ database: DB_APP_NAME }) as Sql
export const db_api = createDatabaseConnection({ database: DB_SESSIONS_NAME }) as Sql

if (!db_app || !db_api) {
    console.warn('[DB] Algunas conexiones a la base de datos no se establecieron correctamente.')
}
