import { SECRET_SESSION_TOKEN } from '#constants/secrets'
import session from 'express-session'

export default session({
    secret: SECRET_SESSION_TOKEN as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
})
