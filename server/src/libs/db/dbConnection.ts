import postgres, { Sql } from 'postgres'

type DBConfig = {
    database: string
    host?: string
    port?: number
    username?: string
    password?: string
}

/**
 * Establece una conexión a una base de datos PostgreSQL utilizando la configuración proporcionada.
 *
 * @param config - El objeto de configuración de la base de datos que contiene las siguientes propiedades:
 *   - `database` (string): El nombre de la base de datos a la que se desea conectar.
 *   - `host` (string): El nombre del host o la dirección IP del servidor de la base de datos.
 *   - `port` (number): El número de puerto en el que el servidor de la base de datos está escuchando.
 *   - `username` (string): El nombre de usuario para autenticarse con la base de datos.
 *   - `password` (string): La contraseña para autenticarse con la base de datos.
 *
 * @returns Una instancia del objeto `Sql` si la conexión es exitosa, o `null` si ocurre un error.
 *
 * @throws Registrará un mensaje de error en la consola si la conexión falla.
 */

export function createDatabaseConnection(config: DBConfig): Sql | null {
    try {
        const sql = postgres({
            database: config.database,
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password,
        })
        console.info(`[DB] Conectando a la base de datos: ${config.database}`)
        tryDatabaseConnection(sql)
        return sql
    } catch (error) {
        console.info(`[DB] Error al conectar con ${config.database}:`, error)
        return null
    }
}

function tryDatabaseConnection(db: Sql): void {
    db`select 1`
        .then(() => {
            console.info(`[DB] Conexión exitosa a la base de datos: ${db.options.database}`)
        })
        .catch(() => {
            console.error(
                `[DB] Error al verificar la conexión a la base de datos: ${db.options.database}`,
            )
        })
}
