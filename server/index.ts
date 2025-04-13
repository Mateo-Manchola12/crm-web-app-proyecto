import express, { NextFunction, Request, Response } from 'express'
import { astroMiddleware, initAstro } from '#middlewares/astro'
import { NODE_ENV, PORT, HOST } from '#constants/environment'
import { buildPath } from '#constants/astro'
import path from 'path'
import { Seller } from '#types/sellers.js'
import { $app } from '#utils/dbQueryHelpers.js'

const app = express()
initAstro()

app.use(express.json())

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(buildPath, 'client')))
}

app.get('/express', async (req: Request, res: Response, next: NextFunction) => {
    const nombre = 'Mateo'
    const apellido = 'Manchola'
    const { data: seller } =
        await $app<Seller>`SELECT * FROM vendedores WHERE UPPER(nombre) = UPPER(${nombre}) AND UPPER(apellido) = UPPER(${apellido})`

    req.body = { message: `Hola ${seller?.nombre} desde Express SSR!` }
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
