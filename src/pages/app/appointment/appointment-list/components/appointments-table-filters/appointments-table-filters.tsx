import { useEffect, useRef } from 'react'
import { Filter, Plus, Search, Users, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { ALL_STATUS_FILTER, APPOINTMENT_STATUS_FILTERS } from '../../constants'

import './appointments-table-filters.css'

const SEARCH_DEBOUNCE_MS = 400

type IAppointmentsTableFilters = {
  onNewAppointment: () => void
}

export function AppointmentsTableFilters({
  onNewAppointment,
}: IAppointmentsTableFilters) {
  const [searchParams, setSearchParams] = useSearchParams()
  const isFirstRender = useRef(true)

  const name = searchParams.get('name') ?? ''
  const status = searchParams.get('status') ?? ALL_STATUS_FILTER

  const { register, watch, setValue } = useForm({ values: { name } })

  const watchedName = watch('name')

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (watchedName === name) return

    const timeout = setTimeout(() => {
      setSearchParams((state) => {
        if (watchedName) state.set('name', watchedName)
        else state.delete('name')
        state.set('pageIndex', '1')
        return state
      })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [watchedName, name, setSearchParams])

  function handleStatusChange(value: string) {
    setSearchParams((state) => {
      if (value !== ALL_STATUS_FILTER) state.set('status', value)
      else state.delete('status')
      state.set('pageIndex', '1')
      return state
    })
  }

  function handleClearFilters() {
    setValue('name', '')
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
        <div className="atf-search">
          <Search className="atf-search-icon" />
          <Input
            {...register('name')}
            placeholder="Buscar por paciente..."
            className="atf-search-input"
          />
        </div>

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
                  <Users className="size-4 text-slate-500" />
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
            <XCircle className="size-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="flex items-center">
        <Button onClick={onNewAppointment} className="atf-new-btn">
          <Plus className="size-4" />
          Nova Consulta
        </Button>
      </div>
    </div>
  )
}
