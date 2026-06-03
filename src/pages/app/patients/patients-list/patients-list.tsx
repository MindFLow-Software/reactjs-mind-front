import './patients-list.css'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Clock,
  Upload,
  QrCode,
  Columns3,
  Activity,
  Download,
  UsersRound,
  UserRoundPlus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Pagination } from '@/components/pagination'

import { MetricCard } from './components/metric-card'
import { PatientsTable } from './components/table/patients-table'
import { RegisterPatients } from './register-patients/register-patients'
import { PatientsPageShell } from '../components/patients-page-shell'
import { PatientsDataBlock } from '../components/patients-data-block'
import { GenerateInviteModal } from './components/dialogs/generate-invite-modal'
import { PatientsTableFilters } from './components/table/patients-table-filters'
import { calcTotalPatients, formatPatientsShowing, hasActiveFilters } from './patients-list.helpers'

import { useHeaderStore } from '@/hooks/use-header-store'
import { usePatientFilters } from '@/hooks/use-patient-filters'
import { usePatientsMetrics } from './hooks/use-patients-metrics'
import { usePatientsListQuery } from './hooks/use-patients-list-query'

export function PatientsList() {
  const { setTitle } = useHeaderStore()
  useEffect(() => { setTitle('Pacientes') }, [setTitle])

  const { filters, setPage, setSort, clearFilters } = usePatientFilters()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const { patients, meta, isLoading, isFetching } = usePatientsListQuery()
  const { activeCount, archivedCount, isLoading: loadingMetrics } = usePatientsMetrics()

  const totalPatients = calcTotalPatients(meta.perPage, meta.totalCount)
  const filtersActive = hasActiveFilters(filters.filter, filters.status)

  return (
    <>
      <Helmet title="Pacientes" />
      <PatientsPageShell
        title="Pacientes"
        description="Gerencie sua base de pacientes — busque, filtre, abra prontuários e mantenha tudo atualizado."
        icon={<UsersRound className="size-6 text-blue-600" />}
        contentClassName="p-0"
        headerRight={
          <div className="pl-header-actions">
            <Button type="button" variant="outline" disabled className="pl-action-btn">
              <Upload className="size-4" />
              Importar
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsInviteOpen(true)} className="pl-action-btn">
              <QrCode className="size-4" />
              <span>Link de auto-cadastro</span>
            </Button>
            <Button type="button" onClick={() => setIsRegisterOpen(true)} className="pl-primary-btn">
              <UserRoundPlus className="size-4" />
              <span>Cadastrar paciente</span>
            </Button>
          </div>
        }
      >
        <div className="pl-metrics-grid">
          <MetricCard
            icon={<UsersRound
              className="size-5 text-blue-600" />}
            iconBg="bg-blue-500/10"
            value={meta.totalCount}
            label="Total de pacientes"
            isLoading={isLoading}
          />
          <MetricCard
            icon={<Activity className="size-5 text-emerald-600" />}
            iconBg="bg-emerald-500/10"
            value={activeCount}
            label="Ativos"
            isLoading={loadingMetrics} />
          <MetricCard
            icon={<Clock className="size-5 text-red-500" />}
            iconBg="bg-red-500/10"
            value={archivedCount}
            label="Arquivados"
            isLoading={loadingMetrics} />
        </div>
        <div className="pl-table-section">
          <PatientsDataBlock
            title="Lista de pacientes"
            description={formatPatientsShowing(totalPatients, meta.totalCount)}
            headerActions={
              <>
                <Button type="button" variant="outline" size="sm" disabled className="pl-table-action-btn">
                  <Download className="size-3.5" />
                  <span>Exportar</span>
                </Button>
                <Button type="button" variant="outline" size="sm" disabled className="pl-table-action-btn">
                  <Columns3 className="size-3.5" />
                  <span>Colunas</span>
                </Button>
              </>
            }
            toolbar={<PatientsTableFilters isFetching={isFetching} />}
            footer={
              meta.totalCount > 0 ? (
                <Pagination
                  pageIndex={meta.pageIndex}
                  totalCount={meta.totalCount}
                  perPage={meta.perPage}
                  onPageChange={setPage}
                />
              ) : null
            }
          >
            <PatientsTable
              patients={patients}
              isLoading={isLoading}
              perPage={filters.perPage}
              hasActiveFilters={filtersActive}
              sort={{ by: filters.sortBy, order: filters.order, onSort: setSort }}
              onClearFilters={clearFilters}
              onRegister={() => setIsRegisterOpen(true)}
            />
          </PatientsDataBlock>
        </div>
      </PatientsPageShell>
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        {isRegisterOpen && <RegisterPatients onSuccess={() => setIsRegisterOpen(false)} />}
      </Dialog>
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <GenerateInviteModal />
      </Dialog>
    </>
  )
}
