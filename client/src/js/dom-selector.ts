/**
 * Obtiene un elemento del DOM por un selector en forma de cadena
 * @example
 *    const elementoClase = $('.mi-clase')
 *    const elementoId = $('#mi-id')
 * @param selector
 * @param context
 * @returns HTMLElement
 */
export const $ = <T extends HTMLElement>(
    selector: string,
    context: Document | HTMLElement = document,
) => {
    return context.querySelector<T>(selector)
}

/**
 * Obtiene múltiples elementos del DOM por un selector en forma de cadena
 * @example
 *    const elementos = $$('.mi-clase')
 * @param selector
 * @param context
 * @returns NodeList
 */
export const $$ = <T extends HTMLElement>(
    selector: string,
    context: Document | HTMLElement = document,
) => {
    return context.querySelectorAll<T>(selector)
}
