import './patients-table-head.css'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import { TableHead } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { PatientSortBy, PatientSortOrder } from '../../../patients-list.types'
import { usePatientsSort } from '../patients-table/patients-table-context'

type IPatientsTableHead = {
  column: PatientSortBy
  label: string
  className?: string
}

type ISortIcon = {
  active: boolean
  order?: PatientSortOrder
}

const ORDER_ICON = {
  [PatientSortOrder.ASC]: ArrowUp,
  [PatientSortOrder.DESC]: ArrowDown,
}

function SortIcon({ active, order }: ISortIcon) {
  if (!active || !order) {
    return <ArrowUpDown className={cn('ptbh-icon', 'ptbh-icon--idle')} />
  }

  const Icon = ORDER_ICON[order]
  return <Icon className={cn('ptbh-icon', 'ptbh-icon--active')} />
}

export function PatientsTableHead({
  column,
  label,
  className,
}: IPatientsTableHead) {
  const sort = usePatientsSort()
  const active = sort?.by === column
  const sortHint =
    active && sort?.order === PatientSortOrder.ASC ? 'Z-A' : 'A-Z'

  return (
    <TableHead className={cn('ptbl-head', className)}>
      <button
        type="button"
        onClick={() => sort?.onSort(column)}
        className={cn(
          'ptbh-button',
          active ? 'ptbh-button--active' : 'ptbh-button--idle',
        )}
        aria-label={`Ordenar por ${label} ${sortHint}`}
      >
        {label}
        <SortIcon active={active} order={sort?.order} />
      </button>
    </TableHead>
  )
}
