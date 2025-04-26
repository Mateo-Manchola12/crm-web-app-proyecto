// Este archivo define funciones genéricas y específicas para realizar consultas a las bases de datos 'db_app' y 'db_api'.
// Proporciona un manejo seguro de consultas SQL, retornando resultados estructurados con indicadores de éxito o error.

import { db_app, db_api } from '#libs/db/db'
import { Sql, Row, ParameterOrFragment, RowList } from 'postgres'

// Tipo genérico para los resultados de las consultas a la base de datos.
type QueryResult<T> = {
    ok: boolean // Indica si la operación fue exitosa.
    data: T | null // Contiene los datos obtenidos o null si hubo un error.
    error: unknown // Contiene el error si ocurrió alguno.
}

/**
 * Realiza una consulta SQL que espera un único resultado.
 * @param sql - Conexión a la base de datos (puede ser null).
 * @param strings - Plantilla de consulta SQL.
 * @param values - Valores para los parámetros de la consulta.
 * @returns Un objeto con el resultado de la consulta.
 */
async function safeOne<T extends Row>(
    sql: Sql | null,
    strings: TemplateStringsArray,
    ...values: ParameterOrFragment<never>[]
): Promise<QueryResult<T>> {
    if (!sql) return { ok: false, data: null, error: '[DB] Sin conexión a la base de datos' }
    try {
        // Ejecuta la consulta y obtiene el primer resultado.
        const result = (await sql<[T]>(strings, ...values)) as RowList<[T]>
        return { ok: true, data: result[0] as T, error: null }
    } catch (error) {
        return { ok: false, data: null, error }
    }
}

/**
 * Realiza una consulta SQL que espera múltiples resultados.
 * @param sql - Conexión a la base de datos (puede ser null).
 * @param strings - Plantilla de consulta SQL.
 * @param values - Valores para los parámetros de la consulta.
 * @returns Un objeto con el resultado de la consulta.
 */
async function safeMany<T extends Row[]>(
    sql: Sql | null,
    strings: TemplateStringsArray,
    ...values: ParameterOrFragment<never>[]
): Promise<QueryResult<T[]>> {
    if (!sql) return { ok: false, data: null, error: '[DB] Sin conexión a la base de datos' }
    try {
        // Ejecuta la consulta y obtiene todos los resultados.
        const result = await sql<T[]>(strings, ...values)
        return { ok: true, data: result, error: null }
    } catch (error) {
        return { ok: false, data: null, error }
    }
}

/**
 * Realiza una consulta SQL en 'db_app' que espera un único resultado.
 * @param strings - Plantilla de consulta SQL.
 * @param values - Valores para los parámetros de la consulta.
 * @returns Un objeto con el resultado de la consulta.
 */
export const $app = <T extends Row = Row>(
    strings: TemplateStringsArray,
    ...values: ParameterOrFragment<never>[]
) => safeOne<T>(db_app, strings, ...values)

/**
 * Realiza una consulta SQL en 'db_app' que espera múltiples resultados.
 * @param strings - Plantilla de consulta SQL.
 * @param values - Valores para los parámetros de la consulta.
 * @returns Un objeto con el resultado de la consulta.
 */
export const $$app = <T extends Row[] = Row[]>(
    strings: TemplateStringsArray,
    ...values: ParameterOrFragment<never>[]
) => safeMany<T>(db_app, strings, ...values)

/**
 * Realiza una consulta SQL en 'db_api' que espera un único resultado.
 * @param strings - Plantilla de consulta SQL.
 * @param values - Valores para los parámetros de la consulta.
 * @returns Un objeto con el resultado de la consulta.
 */
export const $api = <T extends Row = Row>(
    strings: TemplateStringsArray,
    ...values: ParameterOrFragment<never>[]
) => safeOne<T>(db_api, strings, ...values)

/**
 * Realiza una consulta SQL en 'db_api' que espera múltiples resultados.
 * @param strings - Plantilla de consulta SQL.
 * @param values - Valores para los parámetros de la consulta.
 * @returns Un objeto con el resultado de la consulta.
 */
export const $$api = <T extends Row[] = Row[]>(
    strings: TemplateStringsArray,
    ...values: ParameterOrFragment<never>[]
) => safeMany<T>(db_api, strings, ...values)
