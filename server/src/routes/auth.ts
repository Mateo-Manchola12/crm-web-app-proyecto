import express from 'express'
import { generateToken } from '#libs/auth/auth'
import { localLogin, localSignup } from '#libs/auth/strategys'
import flash from '#utils/flash'
import auth from '#middlewares/auth'
import { sendEmail } from '#libs/mail/transport'

const Router = express.Router()

Router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        flash(req, res, {
            message: 'Email y contraseña son requeridos',
            type: 'error',
            duration: 5000,
        })
        res.sendStatus(400)
        return
    }

    const { user, message } = await localLogin(email, password)
    if (!user) {
        flash(req, res, {
            message,
            type: 'error',
            duration: 5000,
        })
        res.sendStatus(401)
        return
    }
    const token = generateToken(user)
    flash(req, res, { message: `¡Bienvenid@ ${user.first_name}!`, type: 'success', duration: 5000 })

    res.clearCookie('auth')
    res.cookie('auth', token, {
        httpOnly: true,
        maxAge: 3600000,
    }).sendStatus(200)
})

Router.post('/signup', async (req, res) => {
    const data = req.body
    const { user, message } = await localSignup(data)

    if (!user) {
        flash(req, res, {
            message,
            type: 'error',
            duration: 5000,
        })
        res.sendStatus(401)
        return
    }

    sendEmail(user.email, 'Es hora de que empieces a fluir', 'welcome', {}).then()

    flash(req, res, {
        message,
        type: 'success',
        duration: 5000,
    })
    res.sendStatus(200)
})

Router.post('/logout', auth, (req, res) => {
    res.clearCookie('auth')
    req.user = undefined
    flash(req, res, {
        message: 'Hasta luego, nos vemos pronto',
        type: 'success',
        duration: 5000,
    })
    res.sendStatus(200)
})

export default Router
