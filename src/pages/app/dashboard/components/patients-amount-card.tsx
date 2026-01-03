"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { HeartHandshake, AlertCircle, Info } from "lucide-react"
import { getAmountPatientsCard } from "@/api/get-amount-patients-card"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

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
        "rounded-xl border bg-card shadow-sm",
        "p-6 transition-all duration-300 hover:shadow-md",
        "border-l-4 border-l-blue-500 dark:border-l-blue-600"
      )}
    >
      <img
        src="/iconCountcard.svg"
        alt="Ícone decorativo"
        className={cn(
          "absolute -bottom-7 -right-6",
          "w-32 h-auto opacity-[2] dark:opacity-[0.55]",
          "pointer-events-none select-none"
        )}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header do Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/10 dark:bg-blue-500/20 p-2 border border-blue-500/20 dark:border-blue-500/30">
              <HeartHandshake className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total de Pacientes
            </span>
          </div>
        </div>

        {state.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : state.isError ? (
          <div className="flex items-center gap-2 text-red-500 py-2">
            <AlertCircle className="size-4" />
            <span className="text-sm font-medium">Erro ao carregar dados</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                {state.total !== null ? state.total.toLocaleString("pt-BR") : "—"}
              </span>
            </div>

            <div className="flex flex-col mt-1">
              <p className="text-sm font-medium text-foreground/80 dark:text-foreground/70">
                Total de pacientes ativos
              </p>

              <div className="flex items-center gap-1.5 mt-0.5">
                <Info className="size-3 text-muted-foreground/60" />
                <p className="text-[11px] text-muted-foreground font-medium">
                  {state.total === 0
                    ? "Aguardando primeiro cadastro"
                    : "Sincronizado com a base de dados"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}