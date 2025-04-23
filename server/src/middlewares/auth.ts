import { findUserById } from '#controllers/loginController.js'
import { verifyToken } from '#libs/auth/auth.js'
import flash from '#utils/flash.js'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export default async function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.auth
    if (!token) {
        flash(req, res, {message: 'Inicia sesión para continuar', type: 'error', duration: 5000})
        res.redirect('/')
        return
    }

    const { id } = (await verifyToken(token)) as JwtPayload & { id: string }
    const user = await findUserById(id)
    if (!user) {
        res.clearCookie('auth')
        flash(req, res, {message: 'Sesión inválida. Usuario no encontrado.', type: 'error', duration: 5000})

        res.redirect('/')
        return
    }
    req.user = user
    next()
}
