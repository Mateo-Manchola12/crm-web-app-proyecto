// Importa el tipo APIContext desde Astro, que representa el contexto de una solicitud HTTP.
import type { APIContext } from 'astro'

// Define un tipo genérico ContextData que representa la estructura de los datos del contexto.
type ContextData<T> = {
    ok: boolean
    data?: T
    error: string | null
}

/**
 * Función que obtiene datos del contexto de la aplicación.
 *
 * @param Astro - Contexto de la solicitud proporcionado por Astro.
 * @returns Un objeto con los datos del contexto.
 *
 * Esta función tiene dos comportamientos principales:
 * 1. En modo desarrollo (`NODE_ENV === "development"`), intenta obtener y parsear un header llamado "body".
 *    Si no se encuentra o no se puede parsear, devuelve un objeto vacío.
 * 2. En otros entornos, devuelve los datos almacenados en `Astro.locals` o null si no existen.
 */
/**
 * Recupera los datos del contexto según el entorno actual y los headers de la solicitud.
 *
 * @template T - El tipo de los datos de contexto que se devolverán.
 * @param {APIContext} Astro - El objeto de contexto de la API que contiene datos de la solicitud y locales.
 * @returns {Promise<ContextData<T>>} Una promesa que resuelve con los datos de contexto parseados
 * de tipo `T` o `null` si los datos no están disponibles o si ocurre un error al parsearlos.
 *
 * @remarks
 * - En un entorno de desarrollo (`NODE_ENV === 'development'`), la función intenta recuperar y parsear
 *   el header `body` de la solicitud como JSON.
 * - Si el header `body` no está presente o no se puede parsear, se registra una advertencia o error
 *   y se devuelve `null`.
 * - En entornos distintos al de desarrollo, la función recupera los datos de contexto desde `Astro.locals`.
 *
 * @example
 * ```typescript
 * const contextData = await getContextData<MyType>(Astro);
 * if (contextData) {
 *     console.log('Datos de Contexto:', contextData);
 * } else {
 *     console.warn('No hay datos de contexto disponibles.');
 * }
 * ```
 */
export async function getContextData<T>(Astro: APIContext): Promise<ContextData<T>> {
    // Verifica si el entorno es de desarrollo.
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
        // Intenta obtener el header "body" de la solicitud.
        const header = Astro.request.headers.get('body')

        // Si el header no existe, muestra una advertencia y devuelve null.
        if (!header) {
            return { ok: false, error: 'No se encontró body en headers' }
        }

        try {
            // Intenta parsear el contenido del header como JSON.
            return { ok: true, data: JSON.parse(header) as T, error: null }
        } catch (err) {
            // Si ocurre un error al parsear, muestra un error en la consola y devuelve un objeto vacío.

            return { ok: false, error: `Error al parsear el header body: ${err}` }
        }
    }

    // En entornos distintos a desarrollo, devuelve los datos de Astro.locals
    return Astro.locals as ContextData<T>
}
