export type Contact = {
    nuip: number
    first_name: string
    last_name: string
    creation_date: string
    city: number
    source: number
    type: 'LEAD' | 'CUSTOMER' | 'COMPANY_LEAD'
}
