"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { HeartHandshake } from "lucide-react"
import { getAmountPatientsCard } from "@/api/get-amount-patients-card"
import { cn } from "@/lib/utils"

interface PatientData {
  total: number
}

const fetchPatientTotal = async (): Promise<PatientData> => {
  try {
    return await getAmountPatientsCard()
  } catch (error) {
    console.error("Erro ao buscar total de pacientes:", error)
    throw error
  }
}

export const PatientsAmountCard = () => {
  const [state, setState] = useState({
    total: null as number | null,
    isLoading: true,
    isError: false,
  })

  useEffect(() => {
    fetchPatientTotal()
      .then((data) =>
        setState({ total: data.total, isLoading: false, isError: false })
      )
      .catch(() =>
        setState((prev) => ({ ...prev, isLoading: false, isError: true }))
      )
  }, [])

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "rounded-2xl",
        "border-b-4 border-b-blue-600",
        "shadow-lg shadow-black/10",
        "p-5",
        "bg-linear-to-br from-blue-100 via-blue-50 to-sky-100",
      )}
    >
      <img
        src="/iconCountcard.svg"
        alt="Ícone decorativo"
        className={cn(
          "absolute bottom-0 right-0",
          "w-3xl h-auto max-w-[140px]",
          "opacity-90",
          "pointer-events-none",
          "translate-x-1/4 translate-y-1/4"
        )}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-blue-200/60 p-2.5 w-fit">
            <HeartHandshake className="size-5 text-blue-700" />
          </div>
        </div>

        {state.isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-20 rounded bg-blue-200/50 animate-pulse" />
            <div className="h-4 w-36 rounded bg-blue-200/50 animate-pulse" />
          </div>
        ) : state.isError ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-red-500">
              Erro ao carregar
            </span>
            <span className="text-xs text-blue-700/70">
              Tente novamente
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-bold tracking-tight text-blue-950">
              {state.total !== null
                ? state.total.toLocaleString("pt-BR")
                : "—"}
            </span>

            <p className="text-sm text-blue-900 font-medium">
              Total de pacientes
            </p>

            {state.total === 0 && (
              <p className="text-xs text-blue-700/70">
                Nenhum paciente cadastrado até o momento.
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
