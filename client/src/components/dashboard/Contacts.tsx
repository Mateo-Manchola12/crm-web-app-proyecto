import { useEffect, useState } from 'react'
import type { Contact } from '@/types/Contacts'
import PieChart from '../ui/PieChart'
import BarChart from '../ui/LineChart.tsx'
import { getApiData } from '@utils/getApiData.ts'

const FILTERS = {
    TODAY: [0],
    LAST_N_MONTHS: [1, 3, 6, 12],
    ALL: [-1],
}

export default function Contacts({ data, filter }: { data: Contact[]; filter: number }) {
    const [total, setTotal] = useState(0)
    const [statistics, setStatistics] = useState({
        byCity: {} as Record<string, number>,
        bySource: {} as Record<string, number>,
        yearHistory: Array(12).fill(0),
    })
    const [states, setStates] = useState<Record<string, unknown[]>>({})

    useEffect(() => {
        getStates().then()
    }, [])

    useEffect(() => {
        generateStatistics()
    }, [data, filter])

    async function getStates() {
        const cities = await getApiData<{ data: { id: number; name: string }[] }>('/api/cities')
        const sources = await getApiData<{ data: { id: number; type: string }[] }>('/api/sources')
        setStates({ cities: cities?.data || [], sources: sources?.data || [] })
    }

    function generateStatistics() {
        if (!data || data.length === 0) {
            setTotal(0)
            setStatistics({ byCity: {}, bySource: {}, yearHistory: Array(12).fill(0) })
            return
        }

        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()

        const filteredData = data.filter((item) => {
            const creationDate = new Date(item.creation_date)
            const diffMonths =
                currentYear * 12 +
                currentMonth -
                (creationDate.getFullYear() * 12 + creationDate.getMonth() + 1)

            if (filter === FILTERS.ALL[0]) return true
            if (filter === FILTERS.TODAY[0]) {
                return (
                    creationDate.getDate() === now.getDate() &&
                    creationDate.getMonth() === now.getMonth() &&
                    creationDate.getFullYear() === now.getFullYear()
                )
            }
            return diffMonths >= 0 && diffMonths < filter
        })

        const byCity = groupBy(filteredData, 'city')
        const bySource = groupBy(filteredData, 'source')
        const yearHistory = Array(12).fill(0)
        data.forEach((item) => {
            const date = new Date(item.creation_date)
            const diffMonths =
                currentYear * 12 + currentMonth - (date.getFullYear() * 12 + date.getMonth() + 1)
            if (diffMonths >= 0 && diffMonths < 12) {
                yearHistory[11 - diffMonths]++
            }
        })

        setTotal(filteredData.length)
        setStatistics({ byCity, bySource, yearHistory })
    }

    function groupBy(data: Contact[], key: keyof Contact) {
        return data.reduce(
            (acc, item) => {
                const value = item[key] as string
                acc[value] = (acc[value] || 0) + 1
                return acc
            },
            {} as Record<string, number>,
        )
    }

    const cityData = Object.entries(statistics.byCity).map(([city, count]) => ({
        id: city,
        label:
            (states?.cities as { id: number; name: string }[])?.find(
                ({ id }) => id === Number(city),
            )?.name ?? '',
        value: count,
    }))

    const sourceData = Object.entries(statistics.bySource).map(([source, count]) => ({
        id: source,
        label:
            (states?.sources as { id: number; type: string }[])?.find(
                ({ id }) => id === Number(source),
            )?.type ?? '',
        value: count,
    }))

    const historyData = {
        id: 'Año en curso',
        data: Array(12)
            .fill(0)
            .map((_, index) => {
                const now = new Date()
                const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1)
                return {
                    x: `${targetDate.getMonth() + 1}/${targetDate.getFullYear()}`,
                    y: data.filter((item) => {
                        const date = new Date(item.creation_date)
                        return (
                            date.getFullYear() === targetDate.getFullYear() &&
                            date.getMonth() === targetDate.getMonth()
                        )
                    }).length,
                }
            })
            .reverse(),
    }

    return (
        <div className="flex grid-cols-2 flex-col md:grid">
            <div className="col-span-2 p-4 text-center">
                <h2 className="text-2xl font-bold">
                    Total de contactos: <span className="text-primary">{total}</span>
                </h2>
            </div>
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold">Distribución por Ciudad</h2>
                <div className="relative flex aspect-[1.4] w-full items-center justify-center">
                    <PieChart data={cityData} />
                    {total <= 0 && (
                        <h2 className="absolute bottom-1/2 text-2xl">Sin datos encontrados</h2>
                    )}
                </div>
            </div>
            <div className="p-4 text-center">
                <h2 className="text-2xl font-bold">Distribución por Fuente</h2>
                <div className="relative flex aspect-[1.4] w-full items-center justify-center">
                    <PieChart data={sourceData} />
                    {total <= 0 && (
                        <h2 className="absolute bottom-1/2 text-2xl">Sin datos encontrados</h2>
                    )}
                </div>
            </div>
            <div className="col-span-2 p-4 text-center">
                <h2 className="text-2xl font-bold">Historial Mensual</h2>
                <div className="relative col-span-2 flex h-80 w-full items-center justify-center">
                    <BarChart data={[historyData]} />
                    {data.length <= 0 && (
                        <h2 className="absolute bottom-1/2 text-2xl">Sin datos encontrados</h2>
                    )}
                </div>
            </div>
        </div>
    )
}
