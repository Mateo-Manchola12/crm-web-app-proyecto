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

Router.post('/api/contact', (req, res) => {
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

    sendEmail(user.email, 'Recibimos tu mensaje!', 'message-received', {})
    sendEmail(NODEMAILER_USER_EMAIL as string, 'Nuevo contacto', 'contact-received', {
        first_name: user.first_name,
        last_name: user.last_name,
        country: user.country,
        email: user.email,
        phone: user.phone,
        organization: user.organization,
        'company-size': user['company-size'],
        'job-title': user['job-title'],
        plan: user.plan,
        'privacy-policy': user['privacy-policy'],
    })
    flash(req, res, {
        message: 'Mensaje enviado correctamente',
        type: 'success',
        duration: 5000,
    })
    res.sendStatus(200)
})

export default Router
