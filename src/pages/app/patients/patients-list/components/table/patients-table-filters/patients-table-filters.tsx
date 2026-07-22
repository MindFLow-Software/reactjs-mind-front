import './patients-table-filters.css'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/form-fields/search-input/search-input'
import { FilterChip } from '@/components/badges/filter-chip/filter-chip'
import { cn } from '@/lib/utils'
import { STATUS_PILLS } from '../../../constants'
import { hasActiveFilters } from '../../../patients-list.helpers'
import { usePatientFilters } from '../../../hooks/use-patient-filters'

type IPatientsTableFilters = {
  isFetching?: boolean
}

export function PatientsTableFilters({ isFetching }: IPatientsTableFilters) {
  const { filters, setFilters, clearFilters } = usePatientFilters()

  const [searchValue, setSearchValue] = useState(filters.filter)

  function handleClearAll() {
    clearFilters()
    setSearchValue('')
  }

  const hasFilters = hasActiveFilters(filters.filter, filters.status)

  return (
    <div className="ptf-root">
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        onDebouncedChange={(value) => setFilters({ filter: value })}
        isLoading={isFetching}
        placeholder="Buscar por nome, CPF, e-mail ou telefone"
        className="ptf-search-input"
      />
      <div className="ptf-status-pills">
        {STATUS_PILLS.map((pill) => {
          const isActive = filters.status === pill.value

          return (
            <FilterChip
              key={pill.value ?? 'all'}
              active={isActive}
              onToggle={() => setFilters({ status: pill.value })}
              className={cn(isActive && pill.activeCls)}
            >
              {pill.dot && <span className={cn('ptf-pill-dot', pill.dot)} />}
              {pill.label}
            </FilterChip>
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
            <X data-icon="inline-start" />
            Limpar filtros
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled
          className="ptf-advanced-btn"
        >
          <SlidersHorizontal data-icon="inline-start" />
          Filtros avançados
        </Button>
      </div>
    </div>
  )
}
