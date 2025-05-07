import { windowStore } from '@/stores'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

export type Section = {
    name: string
    label: string
    view: string
}

export default function useDashboardWindow() {
    const $sections = useStore(windowStore)

    const sections: Section[] = [
        { name: 'home', label: 'Inicio', view: 'home' },
        { name: 'contacts', label: 'Contactos', view: 'contacts' },
        { name: 'customers', label: 'Clientes', view: 'contacts' },
        { name: 'leads', label: 'Prospectos', view: 'contacts' },
        { name: 'company_leads', label: 'Juridicos', view: 'contacts' },
    ]

    const setWindow = (target: string) => {
        sections.forEach(({ name }) => windowStore.setKey(name, false))
        const section = sections.find((section) => section.name === target)
        if (section) {
            windowStore.setKey(target, true)
            window.localStorage.setItem('dashboardWindow', target)
        }
    }

    useEffect(() => {
        const storedWindow = window.localStorage.getItem('dashboardWindow')
        const section = sections.find((section) => section.name === storedWindow) ?? sections[0]
        setWindow(section.name)
    }, [])

    return { $sections, sections, setWindow }
}
