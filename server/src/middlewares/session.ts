import { SECRET_SESSION_TOKEN } from '#constants/secrets.js'
import session from 'express-session'

export default session({
    secret: SECRET_SESSION_TOKEN as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    },
})
