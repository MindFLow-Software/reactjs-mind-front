"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { HeartHandshake, AlertCircle } from "lucide-react"
import { getAmountPatientsCard } from "@/api/get-amount-patients-card"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@radix-ui/react-separator"

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
        "p-4 transition-all duration-300 hover:shadow-md",
        "border-l-4 border-accent-blue"
      )}
    >
      <div className="relative z-10 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent-blue-light/10 p-2 border border-accent-blue-light/20">
              <HeartHandshake className="size-4 text-accent-blue" />
            </div>

            <div className="flex flex-col">
              <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Total de Pacientes
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Em sua clínica
              </CardDescription>
            </div>
          </div>
        </div>

        <Separator
          className="h-0 -mx-4 my-4 w-[calc(100%+2rem)] border-t-2 border-dashed border-muted-foreground/30"
          aria-hidden="true"
        />

        {state.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : state.isError ? (
          <div className="flex items-center gap-2 text-red-500 py-2">
            <AlertCircle className="size-4" />
            <span className="text-sm font-medium">Erro ao carregar dados</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
                {state.total !== null ? state.total.toLocaleString("pt-BR") : "0"}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}