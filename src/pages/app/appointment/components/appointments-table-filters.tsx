"use client"

import { useState, useEffect } from "react"
import { CalendarPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { RegisterAppointment } from "./register-appointment"

const appointmentsFilterSchema = z.object({
    cpf: z.string().optional(),
    name: z.string().optional(),
    status: z.string().optional(),
})

type AppointmentsFilterSchema = z.infer<typeof appointmentsFilterSchema>

export function AppointmentsTableFilters() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)

    const cpf = searchParams.get("cpf")
    const name = searchParams.get("name")
    const status = searchParams.get("status")

    const { register, watch } = useForm<AppointmentsFilterSchema>({
        resolver: zodResolver(appointmentsFilterSchema),
        defaultValues: {
            cpf: cpf ?? "",
            name: name ?? "",
            status: status ?? "all",
        },
    })

    const watchedCpf = watch("cpf")
    const watchedName = watch("name")

    function applyFilters({ cpf, name, status }: AppointmentsFilterSchema) {
        setSearchParams((state) => {
            if (cpf) state.set("cpf", cpf)
            else state.delete("cpf")

            if (name) state.set("name", name)
            else state.delete("name")

            if (status && status !== "all") state.set("status", status)
            else state.delete("status")

            state.set("pageIndex", "0")
            return state
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            applyFilters({
                cpf: watchedCpf,
                name: watchedName,
                status: status ?? "all",
            })
        }, 400)

        return () => clearTimeout(timeout)
    }, [watchedCpf, watchedName])

    return (
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">

            <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
                <Input
                    placeholder="Buscar por Nome do Paciente"
                    className="h-8 w-full lg:w-[320px]"
                    {...register("name")}
                />
            </div>

            <div className="flex items-center">
                <Button
                    size="sm"
                    className="gap-2 w-full lg:w-auto shrink-0 cursor-pointer"
                    onClick={() => setIsRegisterOpen(true)}
                >
                    <CalendarPlus className="h-4 w-4" />
                    Novo agendamento
                </Button>

                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    {isRegisterOpen && <RegisterAppointment />}
                </Dialog>
            </div>
        </div>
    )
}
