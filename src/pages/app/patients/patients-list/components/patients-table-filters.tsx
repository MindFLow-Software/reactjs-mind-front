import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePatientFilters } from '@/hooks/use-patient-filters'
import { cn } from '@/lib/utils'

interface PatientsTableFiltersProps {
  totalCount: number
  activeCount: number
  inactiveCount: number
  isFetching?: boolean
}

type StatusTab = 'all' | 'active' | 'inactive'

const TABS: {
  value: StatusTab
  label: string
  dot?: string
  on: string
  off: string
  hover: string
}[] = [
  {
    value: 'all',
    label: 'Todos',
    on: 'bg-slate-100 text-slate-800 border-slate-200',
    off: 'bg-background text-muted-foreground border-border',
    hover: 'hover:border-slate-400',
  },
  {
    value: 'active',
    label: 'Ativos',
    dot: 'bg-green-600',
    on: 'bg-green-100 text-green-800 border-green-200',
    off: 'bg-background text-muted-foreground border-border',
    hover: 'hover:border-green-400',
  },
  {
    value: 'inactive',
    label: 'Inativos',
    dot: 'bg-red-600',
    on: 'bg-red-100 text-red-800 border-red-200',
    off: 'bg-background text-muted-foreground border-border',
    hover: 'hover:border-red-400',
  },
]

export function PatientsTableFilters({
  totalCount,
  activeCount,
  inactiveCount,
  isFetching,
}: PatientsTableFiltersProps) {
  const { filters, setFilters, clearFilters } = usePatientFilters()
  const isFirstRender = useRef(true)

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
      setFilters({ filter: watchedFilter })
    }, 400)

    return () => clearTimeout(timeout)
  }, [watchedFilter, filters.filter, setFilters])

  function handleClearSearch() {
    setValue('filter', '')
    setFilters({ filter: '' })
  }

  function handleClearAll() {
    clearFilters()
    setValue('filter', '')
  }

  const tabCount = (tab: StatusTab) => {
    if (tab === 'all') return totalCount
    if (tab === 'active') return activeCount
    return inactiveCount
  }

  const hasFilters = !!filters.filter || filters.status !== 'all'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </span>
          <Input
            {...register('filter')}
            placeholder="Buscar por nome, CPF, e-mail ou telefone..."
            className="pl-9 pr-8 h-9 text-sm"
          />
          {watchedFilter && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Limpar busca"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status chips — outline pill */}
        <div className="flex items-center gap-2">
          {TABS.map((tab) => {
            const selected = filters.status === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilters({ status: tab.value })}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer',
                  selected ? tab.on : cn(tab.off, tab.hover),
                )}
              >
                {tab.dot && (
                  <span
                    className={cn('h-1.5 w-1.5 rounded-full shrink-0', tab.dot)}
                  />
                )}
                {tab.label}
                <span className="tabular-nums font-medium opacity-60">
                  {tabCount(tab.value)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 gap-1.5 text-muted-foreground hover:text-destructive text-xs cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros avançados
          </Button>
        </div>
      </div>
    </div>
  )
}
