import { useEffect, useState } from 'react'
import type { Contact } from '@/types/Contacts'
import { getApiData } from '@utils/getApiData.ts'

export default function useDataFetch(name?: string) {
    const [data, setData] = useState<Contact[] | null>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true)
        if (name)
            getApiData<Contact[] | null>(`/dashboard/${name}`)
                .then(setData)
                .catch(() => setData(null))
                .finally(() => setLoading(false))
    }, [name])

    return { data, loading }
}
