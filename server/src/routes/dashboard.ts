import { Seller } from '#types/sellers'
import express from 'express'
import { $$app } from '#libs/db/dbQueryHelpers'

const Router = express.Router()

Router.get('/', (req, res, next) => {
    const user = req.user as Seller
    req.body = {
        first_name: user.first_name,
        last_name: user.last_name,
    }
    next()
})

async function fetchAllContacts() {
    const data: unknown[] = []
    const queries = [
        {
            query: $$app`SELECT nuip, first_name, last_name, creation_date, city, source FROM contact_lead`,
            type: 'LEAD',
        },
        {
            query: $$app`SELECT nuip, first_name, last_name, creation_date, city, source FROM contact_customer`,
            type: 'CUSTOMER',
        },
        {
            query: $$app`SELECT nuip, first_name, last_name, creation_date, city, source FROM contact_company_lead`,
            type: 'COMPANY_LEAD',
        },
    ]

    for (const { query, type } of queries) {
        await query.then(({ data: row }) => {
            row?.forEach((row) => {
                data.push({ ...row, type })
            })
        })
    }

    return data
}

Router.get('/home', async (req, res) => {
    const data = await fetchAllContacts()
    res.status(200).send(data)
})

Router.get('/contacts', async (req, res) => {
    const data = await fetchAllContacts()
    res.status(200).send(data)
})

Router.get('/customers', async (req, res) => {
    const data: unknown[] = []
    await $$app`SELECT nuip,
                       first_name,
                       last_name,
                       creation_date,
                       city,
                       source
                FROM contact_customer`.then(({ data: row }) => {
        row?.forEach((row) => {
            data.push({ ...row, type: 'LEAD' })
        })
    })

    res.status(200).send(data)
})
Router.get('/leads', async (req, res) => {
    const data: unknown[] = []
    await $$app`SELECT nuip,
                       first_name,
                       last_name,
                       creation_date,
                       city,
                       source
                FROM contact_lead`.then(({ data: row }) => {
        row?.forEach((row) => {
            data.push({ ...row, type: 'CUSTOMER' })
        })
    })
    res.status(200).send(data)
})
Router.get('/company_leads', async (req, res) => {
    const data: unknown[] = []
    await $$app`SELECT nuip,
                       first_name,
                       last_name,
                       creation_date,
                       city,
                       source
                FROM contact_company_lead`.then(({ data: row }) => {
        row?.forEach((row) => {
            data.push({ ...row, type: 'COMPANY_LEAD' })
        })
    })
    res.status(200).send(data)
})
Router.get('/task', (req, res) => {
    res.status(200).send({ message: 'task' })
})

export default Router
