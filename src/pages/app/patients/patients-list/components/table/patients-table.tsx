import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  SearchX,
  UserPlus,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { PatientsTableRow } from './patients-table-row'
import { PatientsTableLoading } from './loading'
import type { Ipatient } from '@/types/patient'
import type {
  PatientSortBy,
  PatientSortOrder,
} from '@/hooks/use-patient-filters'
import { cn } from '@/lib/utils'

export interface SortState {
  by: PatientSortBy
  order: PatientSortOrder
  onSort: (column: PatientSortBy) => void
}

interface PatientsTableProps {
  patients: Ipatient[]
  isLoading: boolean
  perPage?: number
  hasActiveFilters?: boolean
  sort?: SortState
  onClearFilters?: () => void
  onRegister?: () => void
}

function SortIcon({
  active,
  order,
}: {
  active: boolean
  order?: PatientSortOrder
}) {
  if (!active)
    return (
      <ArrowUpDown className="ml-1.5 size-3 shrink-0 text-muted-foreground/50" />
    )
  return order === 'asc' ? (
    <ArrowUp className="ml-1.5 size-3 shrink-0 text-primary" />
  ) : (
    <ArrowDown className="ml-1.5 size-3 shrink-0 text-primary" />
  )
}

const COL_HEAD =
  'text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap'

interface SortableHeadProps {
  column: PatientSortBy
  label: string
  sort?: SortState
  className?: string
}

function SortableHead({ column, label, sort, className }: SortableHeadProps) {
  const active = sort?.by === column
  return (
    <TableHead className={cn(COL_HEAD, className)}>
      <button
        type="button"
        onClick={() => sort?.onSort(column)}
        className={cn(
          'flex items-center gap-0 uppercase tracking-wider transition-colors cursor-pointer',
          active ? 'text-foreground' : 'hover:text-foreground/70',
        )}
        aria-label={`Ordenar por ${label} ${active && sort?.order === 'asc' ? 'Z-A' : 'A-Z'}`}
      >
        {label}
        <SortIcon active={active} order={sort?.order} />
      </button>
    </TableHead>
  )
}

interface TableBodyContentProps {
  isLoading: boolean
  patients: Ipatient[]
  perPage: number
  colSpan: number
  hasActiveFilters?: boolean
  onClearFilters?: () => void
  onRegister?: () => void
}

function TableBodyContent({
  isLoading,
  patients,
  perPage,
  colSpan,
  hasActiveFilters,
  onClearFilters,
  onRegister,
}: TableBodyContentProps) {
  if (isLoading) return <PatientsTableLoading rows={perPage} />
  if (patients.length > 0)
    return (
      <>
        {patients.map((patient) => (
          <PatientsTableRow key={patient.id} patient={patient} />
        ))}
      </>
    )
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-20">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          {hasActiveFilters ? (
            <>
              <div className="p-4 rounded-full bg-muted">
                <SearchX className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Nenhum paciente encontrado
                </p>
                <p className="text-xs text-muted-foreground">
                  Tente ajustar os filtros de busca
                </p>
              </div>
              <Button
                variant="outline"
                className="cursor-pointer"
                size="sm"
                onClick={onClearFilters}
              >
                Limpar filtros
              </Button>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-muted">
                <UserPlus className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Nenhum paciente cadastrado
                </p>
                <p className="text-xs text-muted-foreground">
                  Comece cadastrando seu primeiro paciente
                </p>
              </div>
              <Button size="sm" className="cursor-pointer" onClick={onRegister}>
                Cadastrar primeiro paciente
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function PatientsTable({
  patients,
  isLoading,
  perPage = 10,
  hasActiveFilters,
  sort,
  onClearFilters,
  onRegister,
}: PatientsTableProps) {
  const colSpan = 8

  return (
    <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[44px] pl-4">
              <Checkbox aria-label="Selecionar todos" />
            </TableHead>

            <SortableHead
              column="name"
              label="Paciente"
              sort={sort}
              className="min-w-[180px]"
            />
            <SortableHead
              column="status"
              label="Status"
              sort={sort}
              className="w-[120px]"
            />
            <SortableHead
              column="contact"
              label="Contato"
              sort={sort}
              className="min-w-[200px]"
            />
            <SortableHead
              column="lastSession"
              label="Última Sessão"
              sort={sort}
              className="w-[140px] hidden lg:table-cell"
            />
            <SortableHead
              column="age"
              label="Idade"
              sort={sort}
              className="w-[110px] hidden xl:table-cell"
            />
            <SortableHead
              column="gender"
              label="Gênero"
              sort={sort}
              className="w-[110px] hidden xl:table-cell"
            />

            <TableHead className={cn(COL_HEAD, 'w-[110px] text-right pr-3')}>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableBodyContent
            isLoading={isLoading}
            patients={patients}
            perPage={perPage}
            colSpan={colSpan}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
            onRegister={onRegister}
          />
        </TableBody>
      </Table>
    </div>
  )
}
