import { map } from 'nanostores'

export const windowStore = map<Record<string, boolean>>({
    home: false,
    contacts: false,
    customers: false,
    leads: false,
    company_leads: false,
})
