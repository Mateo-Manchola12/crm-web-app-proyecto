import { map } from 'nanostores'

export const windowStore = map<Record<string, boolean>>({
    dashboard: false,
    contact: false,
    client: false,
    leads: false,
    company_leads: false,
    task: false,
})