'use client'

import { XCircle, Users, User, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { usePatientsWithAttachments } from '../../hooks/use-patients-with-attachments'
import { DatePickerWithRange } from '../date-picker-with-range'
import { PatientsSearchInput } from '../../../components/patients-search-input/patients-search-input'
import { cn } from '@/lib/utils'
import type { IUseAttachmentsFiltersReturn } from '../../hooks/use-attachments-filters'
import './attachments-table-filters.css'

const FILE_TYPE_CHIPS = [
  { label: 'Todos', value: undefined, count: null },
  { label: 'PDF', value: 'application/pdf', count: null },
  { label: 'Imagens', value: 'image/', count: null },
  { label: 'DOC', value: 'application/msword', count: null },
] as const

type AttachmentsTableFiltersProps = {
  filters: IUseAttachmentsFiltersReturn
}

export function AttachmentsTableFilters({
  filters,
}: AttachmentsTableFiltersProps) {
  const {
    search,
    setSearch,
    patientId,
    setPatientId,
    date,
    setDate,
    contentType,
    setContentType,
    clearFilters,
  } = filters
  const { data: patients, isLoading } = usePatientsWithAttachments()

  const isPatientSelected = patientId && patientId !== 'all'
  const hasActiveFilter =
    search || isPatientSelected || date?.from || contentType

  return (
    <div className="pd-flt-root">
      {/* File type chips */}
      <div className="pd-flt-chips">
        {FILE_TYPE_CHIPS.map((chip) => {
          const isActive = contentType === chip.value
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => setContentType(chip.value)}
              className={cn(
                'pd-flt-chip',
                isActive ? 'pd-flt-chip-active' : 'pd-flt-chip-idle',
              )}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* Search + dropdowns */}
      <div className="pd-flt-controls">
        <PatientsSearchInput
          placeholder="Buscar por nome, arquivo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={patientId} onValueChange={setPatientId}>
          <SelectTrigger
            className={cn(
              'pd-flt-select',
              !isPatientSelected && 'text-muted-foreground',
            )}
          >
            <div className="pd-flt-select-inner">
              <Filter className="size-3.5 shrink-0 text-muted-foreground" />
              <SelectValue
                placeholder={
                  isLoading ? 'Carregando...' : 'Filtrar por paciente'
                }
              />
            </div>
          </SelectTrigger>

          <SelectContent className="min-w-[220px]">
            <SelectGroup>
              <SelectItem value="all" className="cursor-pointer py-2.5">
                <div className="pd-flt-option">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Todos os Pacientes
                  </span>
                </div>
              </SelectItem>

              {patients?.map((patient) => (
                <SelectItem
                  key={patient.id}
                  value={patient.id}
                  className="cursor-pointer py-2.5"
                >
                  <div className="pd-flt-option">
                    <User className="size-4 shrink-0 text-blue-500" />
                    <span className="pd-flt-option-name">
                      {patient.firstName} {patient.lastName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <DatePickerWithRange
          date={date}
          onDateChange={setDate}
          className="min-w-[220px]"
        />

        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={clearFilters}
            className="pd-flt-clear"
          >
            <XCircle className="size-4" />
            <span className="text-sm">Limpar</span>
          </Button>
        )}
      </div>
    </div>
  )
}
