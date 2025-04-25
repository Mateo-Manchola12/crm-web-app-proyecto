import { windowStore } from '@/stores'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

export default function useDashboardWindow() {
    const $sections = useStore(windowStore)

    const sections = [
        { name: 'dashboard', label: 'Inicio' },
        { name: 'contact', label: 'Contactos' },
        { name: 'client', label: 'Clientes' },
        { name: 'leads', label: 'Prospectos' },
        { name: 'company_leads', label: 'Juridicos' },
        { name: 'task', label: 'Tareas' },
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
