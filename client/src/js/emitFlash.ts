export type Flash = {
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
}

// Emitir un flash directo
export function emitFlash(flash: Flash) {
    window.dispatchEvent(new CustomEvent('flash-message', { detail: flash }))
}

// Forzar que se revise si hay flash en cookie
export function emitFlashFromCookie() {
    window.dispatchEvent(new Event('flash-check-cookie'))
}
