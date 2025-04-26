import nodemailer from 'nodemailer'
import { NODEMAILER_PASSWORD, NODEMAILER_USER } from '#constants/secrets'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD,
    },
})

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: NODEMAILER_USER,
            to,
            subject,
            text,
        })
    } catch (error) {
        console.error('Error al enviar el correo:', error)
    }
}
