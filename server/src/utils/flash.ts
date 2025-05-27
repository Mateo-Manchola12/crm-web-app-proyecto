import { Request, Response } from 'express'

type Flash = {
    message: string
    type: 'success' | 'error' | 'info'
    duration: number
}

export default function flash(req: Request, res: Response, flash: Flash) {
    const cookie = JSON.stringify(flash)

    if (req.cookies['data-flash']) res.clearCookie('data-flash')

    res.cookie('data-flash', cookie, {
        maxAge: flash.duration,
        httpOnly: false,
        path: '/',
        sameSite: 'lax',
    })
}
