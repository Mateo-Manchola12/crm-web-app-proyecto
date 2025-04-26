import { useEffect } from 'react'
import { toast } from 'react-toastify'

type Flash = {
    message: string
    type: 'success' | 'error' | 'info'
    duration: number
}

export default function Flash() {
    useEffect(() => {
        function showFlash() {
            const flashMessage = document.cookie
                .split('; ')
                .find((row) => row.startsWith('data-flash='))
                ?.split('=')[1]

            if (!flashMessage) return

            const flash = JSON.parse(decodeURIComponent(flashMessage)) as Flash

            toast[flash.type](flash.message, {
                pauseOnHover: false,
            })

            document.cookie = 'data-flash=; max-age=0; path=/'
        }

        window.addEventListener('flash-message', showFlash)
        showFlash()

        return () => {
            window.removeEventListener('flash-message', showFlash)
        }
    }, [])

    return null
}
