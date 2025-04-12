// Importa el tipo APIContext desde Astro, que representa el contexto de una solicitud HTTP.
import type { APIContext } from "astro";

/**
 * Función que obtiene datos del contexto de la aplicación.
 *
 * @param Astro - Contexto de la solicitud proporcionado por Astro.
 * @returns Un objeto con los datos del contexto.
 *
 * Esta función tiene dos comportamientos principales:
 * 1. En modo desarrollo (`NODE_ENV === "development"`), intenta obtener y parsear un header llamado "body".
 *    Si no se encuentra o no se puede parsear, devuelve un objeto vacío.
 * 2. En otros entornos, devuelve los datos almacenados en `Astro.locals` o un objeto vacío si no existen.
 */
export async function getContextData(
    Astro: APIContext,
): Promise<Record<string, unknown>> {
    // Verifica si el entorno es de desarrollo.
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
        // Intenta obtener el header "body" de la solicitud.
        const header = Astro.request.headers.get("body");

        // Si el header no existe, muestra una advertencia y devuelve un objeto vacío.
        if (!header) {
            console.warn("No se encontró body en headers");
            return {};
        }

        try {
            // Intenta parsear el contenido del header como JSON.
            return JSON.parse(header);
        } catch (err) {
            // Si ocurre un error al parsear, muestra un error en la consola y devuelve un objeto vacío.
            console.error("Error al parsear body JSON:", err);
            return {};
        }
    }

    // En entornos distintos a desarrollo, devuelve los datos de Astro.locals o un objeto vacío.
    return (Astro.locals as Record<string, unknown>) ?? {};
}
