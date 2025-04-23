import { NODEMAILER_USER } from '#constants/secrets.js'
import { checkIinputs } from '#controllers/signupController.js'
import { sendEmail } from '#libs/mail/transport.js'
import auth from '#middlewares/auth.js'
import flash from '#utils/flash.js'
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
        NODEMAILER_USER as string,
        'Nuevo mensaje de contacto',
        Object.values(user).join('\n'),
    )

    sendEmail(
        user.email,
        'Gracias por contactarnos',
        'Hola! Hemos recibido tu mensaje, Pronto uno de nuestros agentes se pondra en contacto contigo\nVioletFlow',
    )
    flash(req, res, {
        message: 'Mensaje enviado correctamente',
        type: 'success',
        duration: 5000,
    })
    res.sendStatus(200)
})

export default Router
