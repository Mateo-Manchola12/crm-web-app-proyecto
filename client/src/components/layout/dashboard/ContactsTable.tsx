import { useEffect, useState } from 'react'
import { getApiData } from '@utils/getApiData'
import type { Contact } from '@/types/Contacts'

async function fetchData() {
    const citiesResponse = await getApiData<{ data: { id: number; name: string }[] }>('/api/cities')
    const sourcesResponse = await getApiData<{ data: { id: number; type: string }[] }>(
        '/api/sources',
    )

    const cityMap = citiesResponse?.data.reduce(
        (acc, city) => {
            acc[city.id] = city.name
            return acc
        },
        {} as Record<number, string>,
    )

    const sourceMap = sourcesResponse?.data.reduce(
        (acc, source) => {
            acc[source.id] = source.type
            return acc
        },
        {} as Record<number, string>,
    )

    return {
        cities: cityMap || {},
        sources: sourceMap || {},
    }
}

export default function ({ data }: { data: Contact[] }) {
    const [cities, setCities] = useState<Record<number, string>>({})
    const [sources, setSources] = useState<Record<number, string>>({})

    useEffect(() => {
        fetchData().then(({ cities: c, sources: s }) => {
            setCities(c)
            setSources(s)
        })
    }, [])

    return (
        <section className="relative my-10 max-h-[60vh] overflow-y-auto md:mx-10">
            <table className="w-full table-auto border-collapse overflow-hidden rounded-lg shadow-lg">
                <thead className="bg-primary text-on-primary sticky top-0 z-10">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 font-semibold">NUIP</th>
                        <th className="border border-gray-300 px-4 py-2 font-semibold">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2 font-semibold">Apellido</th>
                        <th className="border border-gray-300 px-4 py-2 font-semibold">Ciudad</th>
                        <th className="border border-gray-300 px-4 py-2 font-semibold">Fuente</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((contact: Contact) => (
                        <tr key={contact.nuip} className="even:bg-gray-50 hover:bg-purple-50">
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                {contact.nuip}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                {contact.first_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                {contact.last_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                {cities[Number(contact.city)] || 'Desconocido'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                {sources[Number(contact.source)] || 'Desconocido'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}
