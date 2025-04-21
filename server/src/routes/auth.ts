import { checkEmail, checkIinputs, createSeller } from '#controllers/registerSeller'
import { $app } from '#libs/db/dbQueryHelpers.js'
import { db_app } from '#libs/db/db.js'
import express from 'express'
const Router = express.Router()

Router.post('/login', (req, res) => {
    console.log('Login')
    res.status(200).json({ message: 'Login' })
})
Router.post('/signup', async (req, res) => {
    const user = req.body

    const { result, seller, input } = checkIinputs(user)

    if (!result || !seller) {
        console.log(`Error en el campo ${input}`)
        res.status(400).json({ message: `Error en el campo ${input}` })

        return
    }

    if (await checkEmail(seller?.email)) {
        console.log('Email ya registrado')
        res.status(400).json({ message: 'Email ya registrado' })

        return
    }

    const register = await createSeller(seller, user.password)

    if (!register) {
        console.log('Error al crear el vendedor')
        res.status(400).json({ message: 'Error al crear el vendedor' })

        return
    }

    const data = await $app`INSERT INTO sellers ${db_app?.(register) ?? ''}`

    if (!data.ok) {
        console.log('Error al crear el vendedor')
        res.status(400).json({ message: 'Error al crear el vendedor' })

        return
    }

    console.log('Vendedor creado')
    res.status(200).json({ message: 'Vendedor creado', seller: register })
})

export default Router
