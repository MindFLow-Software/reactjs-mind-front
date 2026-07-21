import { useState } from 'react'
import { Filter, Plus, Users, XCircle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { SearchInput } from '@/components/form-fields/search-input/search-input'
import { cn } from '@/lib/utils'

import { ALL_STATUS_FILTER, APPOINTMENT_STATUS_FILTERS } from '../../constants'

import './appointments-table-filters.css'

type IAppointmentsTableFilters = {
  onNewAppointment: () => void
}

export function AppointmentsTableFilters({
  onNewAppointment,
}: IAppointmentsTableFilters) {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name') ?? ''
  const status = searchParams.get('status') ?? ALL_STATUS_FILTER

  const [searchValue, setSearchValue] = useState(name)

  function applySearch(value: string) {
    setSearchParams((state) => {
      if (value) state.set('name', value)
      else state.delete('name')
      state.set('pageIndex', '1')
      return state
    })
  }

  function handleStatusChange(value: string) {
    setSearchParams((state) => {
      if (value !== ALL_STATUS_FILTER) state.set('status', value)
      else state.delete('status')
      state.set('pageIndex', '1')
      return state
    })
  }

  function handleClearFilters() {
    setSearchValue('')
    setSearchParams((state) => {
      state.delete('name')
      state.delete('status')
      state.set('pageIndex', '1')
      return state
    })
  }

  const hasActiveFilters = Boolean(name) || status !== ALL_STATUS_FILTER

  return (
    <div className="atf-root">
      <div className="atf-filters">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onDebouncedChange={applySearch}
          placeholder="Buscar por paciente..."
          className="atf-search-input"
        />

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="atf-status-trigger">
            <div className="atf-status-value">
              <Filter className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>

          <SelectContent className="atf-status-content">
            <SelectGroup>
              <SelectItem value={ALL_STATUS_FILTER} className="atf-status-item">
                <div className="atf-status-option">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="atf-status-label">Todos os status</span>
                </div>
              </SelectItem>

              {APPOINTMENT_STATUS_FILTERS.map(
                ({ value, label, icon: Icon, iconClassName }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="atf-status-item"
                  >
                    <div className="atf-status-option">
                      <Icon className={cn('size-4', iconClassName)} />
                      <span className="atf-status-label">{label}</span>
                    </div>
                  </SelectItem>
                ),
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleClearFilters}
            className="atf-clear-btn"
          >
            <XCircle data-icon="inline-start" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="flex items-center">
        <Button onClick={onNewAppointment} className="atf-new-btn">
          <Plus data-icon="inline-start" />
          Nova Consulta
        </Button>
      </div>
    </div>
  )
}
