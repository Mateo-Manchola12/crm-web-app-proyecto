import PieChart from '../ui/PieChart'
import BarChart from '../ui/LineChart'
import type { Contact } from '@/types/Contacts'
import { useEffect, useState } from 'react'
import { getApiData } from '@utils/getApiData'

type DataType = 'LEAD' | 'COMPANY_LEAD' | 'CUSTOMER'

const dataTypes: Record<DataType, string> = {
    LEAD: 'Prospectos',
    COMPANY_LEAD: 'Juridicos',
    CUSTOMER: 'Clientes',
}

export default function Home({ data, filter }: { data: Contact[]; filter: number }) {
    const [dataGrouped, setDataGrouped] = useState<Record<DataType, Contact[]>>({
        LEAD: [],
        COMPANY_LEAD: [],
        CUSTOMER: [],
    })
    const [states, setStates] = useState<Record<string, unknown[]>>({})

    useEffect(() => {
        getStates()
    }, [])

    useEffect(() => {
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()

        const filteredData = data.filter((item) => {
            const creationDate = new Date(item.creation_date)
            const diffMonths =
                currentYear * 12 +
                currentMonth -
                (creationDate.getFullYear() * 12 + creationDate.getMonth() + 1)

            if (filter === -1) {
                return true // Todos los datos
            } else if (filter === 0) {
                return (
                    creationDate.getDate() === now.getDate() &&
                    creationDate.getMonth() === now.getMonth() &&
                    creationDate.getFullYear() === now.getFullYear()
                )
            } else {
                return diffMonths >= 0 && diffMonths < filter
            }
        })

        setDataGrouped(
            filteredData.reduce(
                (acc, item) => {
                    const type = item.type as DataType
                    if (!acc[type]) {
                        acc[type] = []
                    }
                    acc[type].push(item)
                    return acc
                },
                { LEAD: [], COMPANY_LEAD: [], CUSTOMER: [] } as Record<DataType, Contact[]>,
            ),
        )
    }, [data, filter])

    async function getStates() {
        const cities = await getApiData<{ data: { id: number; name: string }[] }>('/api/cities')
        const sources = await getApiData<{ data: { id: number; type: string }[] }>('/api/sources')
        setStates({ cities: cities?.data || [], sources: sources?.data || [] })
    }

    const cityData = (type: DataType) =>
        Object.entries(
            dataGrouped[type].reduce(
                (acc, item) => {
                    acc[item.city] = (acc[item.city] || 0) + 1
                    return acc
                },
                {} as Record<string, number>,
            ),
        ).map(([city, count]) => ({
            id: city,
            label:
                (states?.cities as { id: number; name: string }[])?.find(
                    ({ id }) => id === Number(city),
                )?.name ?? '',
            value: count,
        }))

    const sourceData = (type: DataType) =>
        Object.entries(
            dataGrouped[type].reduce(
                (acc, item) => {
                    acc[item.source] = (acc[item.source] || 0) + 1
                    return acc
                },
                {} as Record<string, number>,
            ),
        ).map(([source, count]) => ({
            id: source,
            label:
                (states?.sources as { id: number; type: string }[])?.find(
                    ({ id }) => id === Number(source),
                )?.type ?? '',
            value: count,
        }))

    const historyData = Object.entries(dataTypes).map(([type, label]) => ({
        id: label,
        data: Array(12)
            .fill(0)
            .map((_, index) => {
                const now = new Date()
                const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1)
                return {
                    x: `${targetDate.getMonth() + 1}/${targetDate.getFullYear()}`,
                    y: data
                        .filter((item) => item.type === type)
                        .filter((item) => {
                            const date = new Date(item.creation_date)
                            return (
                                date.getFullYear() === targetDate.getFullYear() &&
                                date.getMonth() === targetDate.getMonth()
                            )
                        }).length,
                }
            })
            .reverse(),
    }))

    const totalCounts = Object.entries(dataTypes).reduce(
        (acc, [type]) => {
            acc[type as DataType] = dataGrouped[type as DataType].length
            return acc
        },
        {} as Record<DataType, number>,
    )

    return (
        <div className="flex grid-cols-3 flex-col md:grid">
            {Object.entries(dataTypes).map(([type, label]) => (
                <div key={type} className="p-2 text-center">
                    <h3 className="text-lg font-bold">{label}</h3>
                    <p className="text-xl">{totalCounts[type as DataType]}</p>
                </div>
            ))}
            <div className="col-span-3 p-4 text-center">
                <h2 className="mb-10 text-2xl font-bold">Distribución por Ciudad</h2>
            </div>
            {Object.entries(dataTypes).map(([type]) => (
                <div className="relative flex aspect-[1.3] w-full items-center justify-center">
                    <PieChart key={`city-${type}`} data={cityData(type as DataType)} />
                    {totalCounts[type as DataType] <= 0 && (
                        <h2 className="absolute bottom-1/2 text-2xl">Sin datos encontrados</h2>
                    )}
                </div>
            ))}
            <div className="col-span-3 p-4 text-center">
                <h2 className="mb-10 text-2xl font-bold">Distribución por Fuente</h2>
            </div>
            {Object.entries(dataTypes).map(([type]) => (
                <div className="relative flex aspect-[1.3] w-full items-center justify-center">
                    <PieChart key={`source-${type}`} data={sourceData(type as DataType)} />
                    {totalCounts[type as DataType] <= 0 && (
                        <h2 className="absolute bottom-1/2 text-2xl">Sin datos encontrados</h2>
                    )}
                </div>
            ))}
            <div className="col-span-3 p-4 text-center">
                <h2 className="mb-10 text-2xl font-bold">Historial Mensual</h2>
            </div>
            <div className="relative col-span-3 flex h-80 w-full items-center justify-center">
                <BarChart data={historyData} />
                {data.length <= 0 && (
                    <h2 className="absolute bottom-1/2 text-2xl">Sin datos encontrados</h2>
                )}
            </div>
        </div>
    )
}
