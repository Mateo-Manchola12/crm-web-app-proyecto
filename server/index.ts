import express from 'express'
import path from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { astroMiddleware, initAstro } from '#middlewares/astro'

import { ENVIRONMENT, SERVER_PORT, SERVER_HOST } from '#constants/environment'
import { buildPath } from '#constants/astro'

import auth from '#routes/auth'
import dashboard from '#routes/dashboard'
import api from '#routes/api'

import session from '#middlewares/session'
import authMiddleware from '#middlewares/auth'
import client from '#routes/client'

const app = express()

app.use(morgan('tiny'))
app.use(cookieParser())
app.use(session)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initAstro().then()

if (ENVIRONMENT === 'production') {
    app.use(express.static(path.join(buildPath, 'client')))
}

app.use(client)
app.use('/api', auth)
app.use('/dashboard', authMiddleware, dashboard)
app.use('/api', authMiddleware, api)
app.use(astroMiddleware)
app.use((req, res) => {
    res.status(404)
    res.sendFile(path.join(buildPath, 'client', '404.html'))
})

app.listen(SERVER_PORT, () => {
    console.info(`El servidor esta corriendo en la ruta ${SERVER_HOST}`)
    console.info(`El servidor esta corriendo en modo ${ENVIRONMENT}`)
})
