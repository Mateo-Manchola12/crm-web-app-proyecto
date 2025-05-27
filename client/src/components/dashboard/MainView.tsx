import useDashboardWindow, { type Section } from '@hooks/useDashboardWindow.ts'
import Home from '@components/dashboard/Home'
import Contacts from '@components/dashboard/Contacts'
import LoadingBanner from '@components/dashboard/LoadingBanner'
import useDataFetch from '@hooks/useDataFetch'
import ErrorBanner from '@components/dashboard/ErrorBanner.tsx'
import { useState } from 'react'
import type { Contact } from '@/types/Contacts'
import ContactsTable from '@components/layout/dashboard/ContactsTable.tsx'

export default function MainView() {
    const { $sections, sections, setWindow } = useDashboardWindow()
    const currentSection = sections.find(({ name }) => $sections[name])
    const { data, loading } = useDataFetch(currentSection?.name)
    const [filter, setFilter] = useState(-1)

    function handleFilter(e: any) {
        const value = Number(e.target.value)
        setFilter(value)
    }

    return (
        <>
            {loading && <LoadingBanner />}
            {!data && !loading && <ErrorBanner />}
            {data && (
                <>
                    <section className="md:mx-10">
                        <div className="flex flex-row justify-between p-4 text-center">
                            <h1 className="mb-10 text-3xl font-bold">Resumen General</h1>
                            <section className="mb-10 md:mx-10">
                                <div className="flex items-center justify-center gap-4 text-xl md:justify-end">
                                    <label htmlFor="dates-filter">Periodo de tiempo:</label>
                                    <div className="relative w-90">
                                        <select
                                            onChange={handleFilter}
                                            id="dates-filter"
                                            name="dates-filter"
                                            value={filter}
                                            className="focus:border-primary focus:ring-primary hover:border-primary hover:ring-primary/30 shadow-primary/100 block w-full appearance-none rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-base shadow-lg transition-all duration-300 hover:bg-purple-50 hover:ring-1 focus:bg-purple-100 focus:ring-2 focus:ring-offset-2 focus:outline-0 active:outline-0"
                                        >
                                            {[0, 1, 3, 6, 12, -1].map((n) => (
                                                <option value={n ?? '-1'} key={`${n}-months`}>
                                                    {n < 0 && 'Siempre'}
                                                    {n == 0 && 'Hoy'}
                                                    {n > 0 && `${n} mes${n > 1 ? 'es' : ''}`}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        {currentSection?.view == 'home' && <Home filter={filter} data={data} />}
                        {currentSection?.view == 'contacts' && (
                            <Contacts filter={filter} data={data} />
                        )}
                    </section>
                    <ContactsTable data={data} />
                </>
            )}
        </>
    )
}
