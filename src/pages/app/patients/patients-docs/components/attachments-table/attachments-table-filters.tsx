'use client'

import { XCircle, Users, User, Filter } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getPatientsWithAttachments } from '@/api/patients/patient-with-attachment'
import { DatePickerWithRange } from '../date-picker-with-range'
import { type DateRange } from 'react-day-picker'
import { PatientsSearchInput } from '../../../components/patients-search-input'
import { cn } from '@/lib/utils'

const FILE_TYPE_CHIPS = [
  { label: 'Todos', value: undefined, count: null },
  { label: 'PDF', value: 'application/pdf', count: null },
  { label: 'Imagens', value: 'image/', count: null },
  { label: 'DOC', value: 'application/msword', count: null },
] as const

interface AttachmentsTableFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  patientId: string
  onPatientChange: (value: string) => void
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  contentType: string | undefined
  onContentTypeChange: (value: string | undefined) => void
  onClearFilters: () => void
}

export function AttachmentsTableFilters({
  search,
  onSearchChange,
  patientId,
  onPatientChange,
  date,
  onDateChange,
  contentType,
  onContentTypeChange,
  onClearFilters,
}: AttachmentsTableFiltersProps) {
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients-with-attachments'],
    queryFn: getPatientsWithAttachments,
    staleTime: 1000 * 60 * 5,
  })

  const isPatientSelected = patientId && patientId !== 'all'
  const hasActiveFilter =
    search || isPatientSelected || date?.from || contentType

  return (
    <div className="flex flex-col gap-3">
      {/* File type chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILE_TYPE_CHIPS.map((chip) => {
          const isActive = contentType === chip.value
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => onContentTypeChange(chip.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-all duration-150 border',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-blue-300 hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30',
              )}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* Search + dropdowns */}
      <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
        <PatientsSearchInput
          placeholder="Buscar por nome, arquivo..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Select value={patientId} onValueChange={onPatientChange}>
          <SelectTrigger
            className={cn(
              'cursor-pointer h-9 w-full lg:w-[240px] bg-background border-muted-foreground/20 hover:border-primary/30 transition-all shadow-sm px-3 text-left font-normal',
              !isPatientSelected && 'text-muted-foreground',
            )}
          >
            <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
              <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <SelectValue
                placeholder={
                  isLoading ? 'Carregando...' : 'Filtrar por paciente'
                }
              />
            </div>
          </SelectTrigger>

          <SelectContent className="min-w-[220px]">
            <SelectItem value="all" className="cursor-pointer py-2.5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Todos os Pacientes</span>
              </div>
            </SelectItem>

            {patients?.map((patient) => (
              <SelectItem
                key={patient.id}
                value={patient.id}
                className="cursor-pointer py-2.5"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <User className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {patient.firstName} {patient.lastName}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePickerWithRange
          date={date}
          onDateChange={onDateChange}
          className="min-w-[220px]"
        />

        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClearFilters}
            className="cursor-pointer h-9 px-2 lg:px-3 text-muted-foreground hover:text-destructive gap-2 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Limpar</span>
          </Button>
        )}
      </div>
    </div>
  )
}
