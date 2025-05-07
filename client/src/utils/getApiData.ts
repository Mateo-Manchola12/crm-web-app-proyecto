import { emitFlash } from '@js/emitFlash.ts'

export async function getApiData<T>(origin: string) {
    const res = await fetch(origin).catch(errorHandler)

    if (!res) return errorHandler()

    if (res.status === 401) return sessionExpiredHandler()
    if (res.status !== 200) return errorHandler()

    const data = await res.json().catch(errorHandler)

    return data as T
}

function errorHandler() {
    emitFlash({
        message: 'Error, no fue posible obtener respuesta del servidor',
        type: 'error',
    })
    return null
}

function sessionExpiredHandler() {
    emitFlash({
        message: 'Se venció su sesión',
        type: 'error',
    })
    window.location.href = '/login'
    return null
}
