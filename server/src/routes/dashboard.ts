import { Seller } from '#types/sellers'
import express from 'express'

const Router = express.Router()

Router.get('/', (req, res, next) => {
    const user = req.user as Seller
    req.body = {
        first_name: user.first_name,
        last_name: user.last_name,
    }
    next()
})

export default Router
