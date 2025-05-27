import nodemailer from 'nodemailer'
import hbs, { HbsTransporter } from 'nodemailer-express-handlebars'
import path from 'path'

import {
    NODEMAILER_CLIENT_ID,
    NODEMAILER_CLIENT_SECRET,
    NODEMAILER_REFRESH_TOKEN,
    NODEMAILER_USER_EMAIL,
} from '#constants/secrets'

import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

const createTransporter = async () => {
    try {
        const oauth2Client = new OAuth2(
            NODEMAILER_CLIENT_ID,
            NODEMAILER_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground',
        )

        oauth2Client.setCredentials({
            refresh_token: NODEMAILER_REFRESH_TOKEN,
        })

        const { token: accessToken } = await oauth2Client.getAccessToken()
        if (!accessToken) {
            throw new Error('[EMAIL] No se pudo obtener el token de acceso.')
        }

        const transporter: HbsTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: NODEMAILER_USER_EMAIL,
                accessToken,
                clientId: NODEMAILER_CLIENT_ID,
                clientSecret: NODEMAILER_CLIENT_SECRET,
                refreshToken: NODEMAILER_REFRESH_TOKEN,
            },
        })
        transporter.use(
            'compile',
            hbs({
                viewEngine: {
                    extname: '.hbs',
                    partialsDir: path.resolve('./src/public/emails'),
                    defaultLayout: path.resolve('./src/public/emails/layout'),
                },
                viewPath: path.resolve('./src/public/emails'),
                extName: '.hbs',
            }),
        )
        return transporter
    } catch (err) {
        console.error('[EMAIL] Error al crear el transportador:', err)
        throw err
    }
}

export const sendEmail = async (
    to: string,
    subject: string,
    template: string,
    context: unknown,
) => {
    try {
        const transporter = await createTransporter()
        transporter.sendMail({
            from: NODEMAILER_USER_EMAIL,
            to,
            subject,
            template,
            context,
        })
    } catch (error) {
        console.error('[EMAIL] Error al enviar el correo:', error)
        throw error
    }
}
