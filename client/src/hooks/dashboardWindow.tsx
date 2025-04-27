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
        { name: 'contact', label: 'Contactos', view: 'clients' },
        { name: 'client', label: 'Clientes', view: 'clients' },
        { name: 'leads', label: 'Prospectos', view: 'clients' },
        { name: 'company_leads', label: 'Juridicos', view: 'clients' },
        { name: 'task', label: 'Tareas', view: 'task' },
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
