import express from 'express'
import path from 'path'
import morgan from 'morgan'

import { astroMiddleware, initAstro } from '#middlewares/astro'
import { db_app, db_api } from '#db'

import { NODE_ENV, PORT, HOST } from '#constants/environment'
import { buildPath } from '#constants/astro'

import auth from '#routes/auth'

const app = express()
initAstro()

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(buildPath, 'client')))
}

app.use(auth)
app.use(astroMiddleware)
app.use((req, res) => {
    res.status(404)
    res.sendFile(path.join(buildPath, 'client', '404.html'))
})

app.listen(PORT, () => {
    console.info(`El servidor esta corriendo en la ruta ${HOST}`)
    console.info(`El servidor esta corriendo en modo ${NODE_ENV}`)
})
