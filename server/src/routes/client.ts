import { NODEMAILER_USER_EMAIL } from '#constants/secrets'
import { checkIinputs } from '#controllers/signupController'
import { sendEmail } from '#libs/mail/transport'
import auth from '#middlewares/auth'
import flash from '#utils/flash'
import express from 'express'

const Router = express.Router()

Router.get('/download', auth, (req, res, next) => {
    next()
})

Router.post('/contact', (req, res) => {
    const user = req.body
    const { result, input } = checkIinputs(user)
    if (!result) {
        flash(req, res, {
            message: `Campo inválido: ${input}`,
            type: 'error',
            duration: 5000,
        })
        res.sendStatus(400)
        return
    }

    sendEmail(
        NODEMAILER_USER_EMAIL as string,
        'Nuevo mensaje de contacto',
        Object.values(user).join('\n'),
    ).then()

    sendEmail(
        user.email,
        'Gracias por contactarnos',
        'Hola! Hemos recibido tu mensaje, Pronto uno de nuestros agentes se pondra en contacto contigo\nVioletFlow',
    ).then()
    flash(req, res, {
        message: 'Mensaje enviado correctamente',
        type: 'success',
        duration: 5000,
    })
    res.sendStatus(200)
})

export default Router
