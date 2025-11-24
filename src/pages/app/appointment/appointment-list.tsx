import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { Pagination } from "@/components/pagination"
import { AppointmentsTableFilters } from "./components/appointments-table-filters"
import { AppointmentsTable } from "./components/appointments-table-row"

import { getAppointments, type GetAppointmentsResponse } from "@/api/get-appointment"

export function AppointmentsList() {
    const [searchParams, setSearchParams] = useSearchParams()

    const pageIndex = Number(searchParams.get("pageIndex") ?? 0)
    const perPage = 12

    const cpf = searchParams.get("cpf") || undefined
    const name = searchParams.get("name") || undefined
    const status = searchParams.get("status") || undefined

    const { data: result, isLoading } = useQuery<GetAppointmentsResponse>({
        queryKey: ["appointments", pageIndex, perPage, cpf, name, status],
        queryFn: () =>
            getAppointments({
                pageIndex,
                perPage,
                cpf,
                name,
                status,
            }),
        staleTime: 1000 * 60 * 5,
    })

    const appointments = result?.appointments ?? []
    const meta = result?.meta ?? { pageIndex, perPage, totalCount: 0 }

    const handlePaginate = (newPageIndex: number) => {
        setSearchParams((state) => {
            state.set("pageIndex", String(newPageIndex))
            return state
        })
    }

    return (
        <>
            <Helmet title="Agendamentos" />

            <div className="flex flex-col gap-4 mt-6">
                <div className="space-y-5">

                    <AppointmentsTableFilters />

                    <AppointmentsTable
                        appointments={appointments}
                        isLoading={isLoading}
                        perPage={perPage}
                    />

                    {result && (
                        <Pagination
                            pageIndex={meta.pageIndex}
                            totalCount={meta.totalCount}
                            perPage={meta.perPage}
                            onPageChange={handlePaginate}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
