import './patients-table-filters.css'
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { STATUS_PILLS } from '../../../constants'
import { usePatientFilters } from '../../../hooks/use-patient-filters'

const SEARCH_DEBOUNCE_MS = 400

type IPatientsTableFilters = {
  isFetching?: boolean
}

export function PatientsTableFilters({ isFetching }: IPatientsTableFilters) {
  const { filters, setFilters, clearFilters } = usePatientFilters()
  const isFirstRender = useRef(true)
  const setFiltersRef = useRef(setFilters)
  setFiltersRef.current = setFilters

  const { register, watch, setValue } = useForm({
    values: { filter: filters.filter },
  })

  const watchedFilter = watch('filter')

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (watchedFilter === filters.filter) return

    const timeout = setTimeout(() => {
      setFiltersRef.current({ filter: watchedFilter })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [watchedFilter, filters.filter])

  function handleClearSearch() {
    setValue('filter', '')
    setFilters({ filter: '' })
  }

  function handleClearAll() {
    clearFilters()
    setValue('filter', '')
  }

  const hasFilters = !!filters.filter || filters.status !== null

  return (
    <div className="ptf-root">
      <div className="ptf-search-wrapper">
        <span className="ptf-search-icon">
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>
        <Input
          {...register('filter')}
          placeholder="Buscar por nome, CPF, e-mail ou telefone"
          autoComplete="off"
          className="ptf-search-input"
        />
        {watchedFilter && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="ptf-search-clear"
            aria-label="Limpar busca"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="ptf-status-pills">
        {STATUS_PILLS.map((pill) => {
          const isActive = filters.status === pill.value

          return (
            <button
              key={pill.value ?? 'all'}
              type="button"
              onClick={() => setFilters({ status: pill.value })}
              className={cn(
                'ptf-pill',
                isActive ? pill.activeCls : 'ptf-pill--inactive',
              )}
            >
              {pill.dot && <span className={cn('ptf-pill-dot', pill.dot)} />}
              {pill.label}
            </button>
          )
        })}
      </div>

      <div className="ptf-right-actions">
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="ptf-clear-btn"
          >
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled
          className="ptf-advanced-btn"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtros avançados
        </Button>
      </div>
    </div>
  )
}
