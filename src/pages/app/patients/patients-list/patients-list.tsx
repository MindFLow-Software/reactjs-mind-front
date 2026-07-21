import './patients-list.css'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { UsersRound } from 'lucide-react'

import { Dialog } from '@/components/ui/dialog'
import { Pagination } from '@/components/pagination/pagination'
import { useHeaderStore } from '@/store/use-header-store'

import { PatientsPageShell } from '../components/patients-page-shell/patients-page-shell'
import { PatientsDataBlock } from '../components/patients-data-block/patients-data-block'

import { PatientsMetrics } from './components/patients-metrics/patients-metrics'
import { PatientsListActions } from './components/patients-list-actions/patients-list-actions'
import { PatientsTableActions } from './components/patients-table-actions/patients-table-actions'
import { PatientsTable } from './components/table/patients-table/patients-table'
import { PatientsTableEmpty } from './components/table/patients-table-empty/patients-table-empty'
import { PatientsTableFilters } from './components/table/patients-table-filters/patients-table-filters'
import { RegisterPatients } from './components/dialogs/register-patients/register-patients'
import { GenerateInviteModal } from './components/dialogs/generate-invite-modal/generate-invite-modal'

import {
  hasActiveFilters,
  calcTotalPatients,
  formatPatientsShowing,
} from './patients-list.helpers'
import { usePatientFilters } from './hooks/use-patient-filters'
import { usePatientsMetrics } from './hooks/use-patients-metrics'
import { usePatientsListQuery } from './hooks/use-patients-list-query'

export function PatientsList() {
  const { setTitle } = useHeaderStore()

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const { filters, setPage, setSort, clearFilters } = usePatientFilters()
  const { patients, meta, isLoading, isFetching } = usePatientsListQuery()
  const {
    activeCount,
    archivedCount,
    newPatientsCount,
    isLoading: isLoadingMetrics,
  } = usePatientsMetrics()

  const totalPatients = calcTotalPatients(meta.perPage, meta.totalCount)
  const filtersActive = hasActiveFilters(filters.filter, filters.status)

  const openInvite = useCallback(() => setIsInviteOpen(true), [])
  const openRegister = useCallback(() => setIsRegisterOpen(true), [])

  const sort = filters.sortBy
    ? { by: filters.sortBy, order: filters.order, onSort: setSort }
    : undefined

  useEffect(() => {
    setTitle('Pacientes')
  }, [setTitle])

  return (
    <>
      <Helmet title="Pacientes" />

      <PatientsPageShell>
        <PatientsPageShell.Header
          title="Pacientes"
          description="Gerencie sua base de pacientes — busque, filtre, abra prontuários e mantenha tudo atualizado."
          icon={<UsersRound className="size-6 text-blue-600" />}
        >
          <PatientsListActions
            onInvite={openInvite}
            onRegister={openRegister}
          />
        </PatientsPageShell.Header>

        <PatientsPageShell.Content>
          <PatientsMetrics
            counts={{
              totalCount: meta.totalCount,
              activeCount,
              archivedCount,
              newPatientsCount,
            }}
            state={{ isLoadingTotal: isLoading, isLoadingMetrics }}
          />

          <div className="pl-table-section">
            <PatientsDataBlock>
              <PatientsDataBlock.Header
                title="Lista de pacientes"
                description={formatPatientsShowing(
                  totalPatients,
                  meta.totalCount,
                )}
              >
                <PatientsTableActions />
              </PatientsDataBlock.Header>

              <PatientsDataBlock.Toolbar>
                <PatientsTableFilters isFetching={isFetching} />
              </PatientsDataBlock.Toolbar>

              <PatientsDataBlock.Content>
                <PatientsTable sort={sort}>
                  <PatientsTable.Body
                    patients={patients}
                    state={{ isLoading, perPage: filters.perPage }}
                  >
                    <PatientsTableEmpty
                      filters={{ active: filtersActive, onClear: clearFilters }}
                      onRegister={openRegister}
                    />
                  </PatientsTable.Body>
                </PatientsTable>
              </PatientsDataBlock.Content>

              <PatientsDataBlock.Footer>
                <Pagination
                  pagination={{
                    pageIndex: meta.pageIndex,
                    totalCount: meta.totalCount,
                    perPage: meta.perPage,
                    onPageChange: setPage,
                  }}
                  totalLabel="Pacientes"
                />
              </PatientsDataBlock.Footer>
            </PatientsDataBlock>
          </div>
        </PatientsPageShell.Content>
      </PatientsPageShell>

      <RegisterPatients
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
      />

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <GenerateInviteModal />
      </Dialog>
    </>
  )
}
