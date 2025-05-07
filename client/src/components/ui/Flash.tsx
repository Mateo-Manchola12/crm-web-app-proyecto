import { useEffect } from 'react'
import { toast } from 'react-toastify'
import type { Flash } from '@js/emitFlash'

export default function Flash() {
    useEffect(() => {
        const checkCookie = () => {
            const raw = document.cookie
                .split('; ')
                .find((c) => c.startsWith('data-flash='))
                ?.split('=')[1]

            if (raw) {
                try {
                    const decoded = decodeURIComponent(raw)
                    const flash: Flash = JSON.parse(decoded)
                    showFlash(flash)
                } catch (err) {
                    console.error('Error parsing flash from cookie', err)
                }

                document.cookie = 'data-flash=; Max-Age=0; Path=/'
            }
        }

        // Mostrar mensaje desde cookie al cargar
        checkCookie()

        // Escuchar evento personalizado para revisar cookies de nuevo
        const onCheckCookie = () => checkCookie()

        // Escuchar evento para mostrar un flash directamente
        const onFlashMessage = (e: Event) => {
            const flash = (e as CustomEvent).detail as Flash
            showFlash(flash)
        }

        window.addEventListener('flash-message', onFlashMessage)
        window.addEventListener('flash-check-cookie', onCheckCookie)

        return () => {
            window.removeEventListener('flash-message', onFlashMessage)
            window.removeEventListener('flash-check-cookie', onCheckCookie)
        }
    }, [])

    function showFlash(flash: Flash) {
        toast[flash.type](flash.message, {
            autoClose: flash.duration ?? 3000,
            pauseOnHover: true,
        })
    }

    return <></>
}
