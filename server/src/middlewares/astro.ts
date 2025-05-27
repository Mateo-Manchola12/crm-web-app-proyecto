// Este archivo define un middleware para integrar Astro en una aplicación Node.js.
// Proporciona un manejador dinámico que se ajusta al entorno de ejecución (desarrollo o producción).

import { dev, build } from 'astro'
import { ENVIRONMENT } from '#constants/environment'
import { buildPath, clientPath } from '#constants/astro'
import { NextFunction, Request, Response } from 'express'
import path from 'path'

// Tipos para los handlers
export type Locals = Record<string, unknown>

export type AstroProductionHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
    locals?: Locals,
) => Promise<void>

export type AstroDevHandler = (req: Request, res: Response) => void

export type AstroHandler = AstroDevHandler | AstroProductionHandler

let cachedAstroHandler: AstroHandler | null = null

/**
 * Determina si el handler es de desarrollo (2 argumentos)
 */
function isDevHandler(fn: AstroHandler): fn is AstroDevHandler {
    return fn.length === 2
}

/**
 * Determina si el handler es de producción (3 o más argumentos)
 */
function isProdHandler(fn: AstroHandler): fn is AstroProductionHandler {
    return typeof (fn as AstroProductionHandler).apply === 'function'
}

/**
 * Crea un manejador de Astro basado en el entorno de ejecución.
 */
async function createAstroHandler(): Promise<AstroHandler> {
    if (ENVIRONMENT === 'development') {
        const server = await dev({ root: clientPath })
        return server.handle
    }

    if (ENVIRONMENT === 'production') {
        await build({ root: clientPath })
        const entry = await import(path.resolve(buildPath, 'server', 'entry.mjs'))
        return entry.handler
    }

    throw new Error('Unknown environment: ' + ENVIRONMENT)
}

/**
 * Devuelve el manejador de Astro con caché
 */
export async function getAstroHandler(): Promise<AstroHandler> {
    if (!cachedAstroHandler) {
        cachedAstroHandler = await createAstroHandler()
    }
    return cachedAstroHandler
}

/**
 * Middleware principal para manejar solicitudes con Astro.
 */
export async function astroMiddleware(req: Request, res: Response, next: NextFunction) {
    const astroHandler = await getAstroHandler()

    if (isDevHandler(astroHandler) && ENVIRONMENT === 'development') {
        req.headers.body = JSON.stringify(req.body || {})
        return astroHandler(req, res)
    }

    if (isProdHandler(astroHandler) && ENVIRONMENT === 'production') {
        const locals: Locals = req.body || {}
        return astroHandler(req, res, next, locals)
    }

    return next()
}

/**
 * Inicializa Astro y maneja errores.
 */
export async function initAstro() {
    getAstroHandler()
        .then(() => {
            console.info('Astro Inicializado correctamente')
        })
        .catch(() => {
            console.error('Error al inicializar Astro')
            process.exit(1)
        })
}
