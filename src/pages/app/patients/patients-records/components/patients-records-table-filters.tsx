'use client'

import {
  XCircle,
  VenusAndMars,
  Mars,
  Venus,
  History,
  ClockArrowUp,
  ClockArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { IsessionVolume } from '@/types/patient'
import { PatientsSearchInput } from '../../components/patients-search-input'
import './patients-records-table-filters.css'

interface FilterControl<T> {
  value: T
  onChange: (value: T) => void
}

interface PatientsRecordsTableFiltersProps {
  search: FilterControl<string>
  gender: FilterControl<string>
  sessionOrder: FilterControl<IsessionVolume>
  onClearFilters: () => void
}

export function PatientsRecordsTableFilters({
  search,
  gender,
  sessionOrder,
  onClearFilters,
}: PatientsRecordsTableFiltersProps) {
  const hasAnyFilter =
    search.value !== '' ||
    gender.value !== 'all' ||
    sessionOrder.value !== 'all'

  return (
    <div className="pr-flt-root">
      <div className="pr-flt-group">
        <PatientsSearchInput
          placeholder="Buscar por Nome"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          wrapperClassName="w-full lg:w-[300px]"
        />

        <div className="pr-flt-selects">
          {/* Gênero */}
          <Select value={gender.value} onValueChange={gender.onChange}>
            <SelectTrigger className="pr-flt-select">
              <div className="pr-flt-select-inner">
                <SelectValue placeholder="Gênero" />
              </div>
            </SelectTrigger>
            <SelectContent className="min-w-[200px]">
              <SelectItem value="all" className="cursor-pointer py-2.5">
                <div className="pr-flt-option">
                  <VenusAndMars className="h-4 w-4 text-slate-500" />
                  <span>Todos Gêneros</span>
                </div>
              </SelectItem>
              <SelectItem value="MASCULINE" className="cursor-pointer py-2.5">
                <div className="pr-flt-option">
                  <Mars className="h-4 w-4 text-blue-500" />
                  <span>Masculinos</span>
                </div>
              </SelectItem>
              <SelectItem value="FEMININE" className="cursor-pointer py-2.5">
                <div className="pr-flt-option">
                  <Venus className="h-4 w-4 text-rose-500" />
                  <span>Femininos</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sessões */}
          <Select
            value={sessionOrder.value}
            onValueChange={(v) => sessionOrder.onChange(v as IsessionVolume)}
          >
            <SelectTrigger className="pr-flt-select">
              <div className="pr-flt-select-inner">
                <SelectValue placeholder="Sessões" />
              </div>
            </SelectTrigger>
            <SelectContent className="min-w-[200px]">
              <SelectItem value="all" className="cursor-pointer py-2.5">
                <div className="pr-flt-option">
                  <History className="h-4 w-4 text-slate-500" />
                  <span>Total Sessões</span>
                </div>
              </SelectItem>
              <SelectItem value="high" className="cursor-pointer py-2.5">
                <div className="pr-flt-option">
                  <ClockArrowUp className="h-4 w-4 text-emerald-500" />
                  <span>Mais Sessões</span>
                </div>
              </SelectItem>
              <SelectItem value="low" className="cursor-pointer py-2.5">
                <div className="pr-flt-option">
                  <ClockArrowDown className="h-4 w-4 text-rose-500" />
                  <span>Menos Sessões</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão Limpar */}
        {hasAnyFilter && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClearFilters}
            className="pr-flt-clear"
          >
            <XCircle className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}
