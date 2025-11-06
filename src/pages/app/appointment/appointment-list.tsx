"use client"

import { Helmet } from "react-helmet-async"
import { AppointmentForm } from "./components/appointment-form"
import { AppointmentsTable } from "./components/appointments-table"

export function AppointmentsPage() {
    return (
        <>
            <Helmet title="Agendamentos" />

            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Agendamentos</h1>

                {/* Grid geral */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                    {/* Formulário */}
                    <div className="sm:col-span-1">
                        <AppointmentForm />
                    </div>

                    <div className="sm:col-span-2">
                        <AppointmentsTable />
                    </div>
                </div>
            </div>
        </>
    )
}
