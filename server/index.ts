import express, { NextFunction, Request, Response } from 'express'
import { astroMiddleware } from '#middlewares/astro'
import { NODE_ENV, PORT, HOST } from '#constants/environment'
import { buildPath } from '#constants/astro'
import path from 'path'

const app = express()
app.use(express.json())

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(buildPath, 'client')))
}

app.get('/express', (req: Request, res: Response, next: NextFunction) => {
    req.body = { message: 'Hola desde Express SSR!' }
    next()
})

app.get('/api', (req: Request, res: Response) => {
    res.send('Hola, esta es una ruta de mi API con express!')
})

app.use(astroMiddleware)

app.listen(PORT, () => {
    console.info(`El servidor esta corriendo en la ruta ${HOST}`)
    console.info(`El servidor esta corriendo en modo ${NODE_ENV}`)
})
