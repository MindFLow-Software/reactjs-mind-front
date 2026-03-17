"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle2, Filter, QrCode, UserRoundPlus, Users, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { usePatientFilters } from "@/hooks/use-patient-filters"
import { GenerateInviteModal } from "./generate-Invite-modal"
import { RegisterPatients } from "../register-patients/register-patients"
import { PatientsSearchInput } from "../../components/patients-search-input"
import { cn } from "@/lib/utils"

interface PatientsTableFiltersProps {
  onPatientRegistered?: () => void
}

export function PatientsTableFilters({ onPatientRegistered }: PatientsTableFiltersProps) {
  const { filters, setFilters, clearFilters } = usePatientFilters()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const isFirstRender = useRef(true)

  const { register, watch, setValue } = useForm({
    values: {
      filter: filters.filter,
    },
  })

  const watchedFilter = watch("filter")

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (watchedFilter === filters.filter) {
      return
    }

    const timeout = setTimeout(() => {
      setFilters({ filter: watchedFilter })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedFilter, filters.filter, setFilters])

  function handleClearFilters() {
    clearFilters()
    setValue("filter", "")
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div className="flex flex-col lg:flex-row gap-2 flex-1 lg:items-center">
        <PatientsSearchInput
          {...register("filter")}
          placeholder="Buscar por CPF, Nome e Email"
        />

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ status: value })}
        >
          <SelectTrigger
            className="cursor-pointer h-9 min-w-[180px] w-auto bg-background
            border-muted-foreground/20 hover:border-primary/30 transition-all
            shadow-sm px-3"
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>

          <SelectContent className="min-w-[220px]">
            <SelectItem value="all" className="cursor-pointer py-2.5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Todos os Pacientes</span>
              </div>
            </SelectItem>

            <SelectItem value="active" className="cursor-pointer py-2.5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Pacientes Ativos</span>
              </div>
            </SelectItem>

            <SelectItem value="inactive" className="cursor-pointer py-2.5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <XCircle className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium">Pacientes Inativos</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {(filters.filter || filters.status !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleClearFilters}
            className="cursor-pointer h-8 px-2 lg:px-3 text-muted-foreground hover:text-destructive gap-2 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className={cn(
            "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl px-4",
            "bg-blue-600 text-[13px] font-medium text-white",
            "shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all",
            "hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98] border-none outline-none",
          )}
        >
          <UserRoundPlus className="h-4 w-4" />
          Cadastrar paciente
        </button>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className={cn(
            "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl px-4",
            "border border-blue-600/20 bg-white text-[13px] font-medium text-blue-600",
            "shadow-[0_1px_4px_rgba(37,99,235,0.08)] transition-all",
            "hover:border-blue-600/40 hover:bg-blue-50 hover:-translate-y-px active:scale-[0.98] outline-none",
          )}
        >
          <QrCode className="h-4 w-4" />
          QR Code de cadastro
        </button>
      </div>

      {/* Dialogs */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        {isRegisterOpen && (
          <RegisterPatients
            onSuccess={() => {
              setIsRegisterOpen(false)
              onPatientRegistered?.()
            }}
          />
        )}
      </Dialog>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <GenerateInviteModal />
      </Dialog>
    </div>
  )
}
