import '../patients-columns.css'
import './patients-table.css'
import type { ReactNode } from 'react'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { IPatient } from '@/types/patient/patient'

import { PatientsTableRow } from '../patients-table-row/patients-table-row'
import { PatientsTableLoading } from '../patients-table-loading/patients-table-loading'
import { PatientsTableHead } from '../patients-table-head/patients-table-head'
import { PatientSortBy, type IPatientsSort } from '../../../patients-list.types'
import { PatientsSortContext } from './patients-table-context'

type IPatientsTableRoot = {
  sort?: IPatientsSort
  children: ReactNode
}

type IPatientsTableBody = {
  patients: IPatient[]
  state: { isLoading: boolean; perPage: number }
  children: ReactNode
}

function PatientsTableRoot({ sort, children }: IPatientsTableRoot) {
  return (
    <PatientsSortContext.Provider value={sort}>
      <Card className="ptbl-card">
        <Table>
          <TableHeader>
            <TableRow className="ptbl-head-row">
              <TableHead className="ptc-checkbox">
                <Checkbox aria-label="Selecionar todos" />
              </TableHead>

              <PatientsTableHead
                column={PatientSortBy.NAME}
                label="Paciente"
                className="ptc-identity"
              />
              <PatientsTableHead
                column={PatientSortBy.STATUS}
                label="Status"
                className="ptc-status"
              />

              <TableHead className={cn('ptbl-head', 'ptc-contact')}>
                Contato
              </TableHead>

              <PatientsTableHead
                column={PatientSortBy.LAST_SESSION}
                label="Última Sessão"
                className="ptc-last-session"
              />
              <PatientsTableHead
                column={PatientSortBy.AGE}
                label="Idade"
                className="ptc-age"
              />
              <PatientsTableHead
                column={PatientSortBy.GENDER}
                label="Gênero"
                className="ptc-gender"
              />

              <TableHead
                className={cn('ptbl-head', 'ptc-actions', 'text-right')}
              >
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>{children}</TableBody>
        </Table>
      </Card>
    </PatientsSortContext.Provider>
  )
}

function PatientsTableBody({ patients, state, children }: IPatientsTableBody) {
  if (state.isLoading) return <PatientsTableLoading rows={state.perPage} />
  if (patients.length === 0) return children

  return patients.map((patient) => (
    <PatientsTableRow key={patient.id} patient={patient} />
  ))
}

export const PatientsTable = Object.assign(PatientsTableRoot, {
  Body: PatientsTableBody,
})
