import express from 'express'
import { $$app } from '#libs/db/dbQueryHelpers'

const Router = express.Router()

Router.get('/cities', async (req, res) => {
    const cities = await $$app<{ id: number; name: string }[]>`SELECT id, name
                                                               FROM cities`

    res.status(200).send(cities)
})
Router.get('/sources', async (req, res) => {
    const sources = await $$app<{ id: number; type: string }[]>`SELECT id, type
                                                                FROM contact_sources`
    res.status(200).send(sources)
})

export default Router
