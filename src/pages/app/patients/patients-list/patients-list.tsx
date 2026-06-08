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
import {
  hasActiveFilters,
  calcTotalPatients,
  formatPatientsShowing,
} from './patients-list.helpers'

import { useHeaderStore } from '@/hooks/use-header-store'
import { usePatientFilters } from '@/hooks/use-patient-filters'
import { usePatientsMetrics } from './hooks/use-patients-metrics'
import { usePatientsListQuery } from './hooks/use-patients-list-query'

type IregisterModal = {
  isOpen: boolean
  isEditing?: boolean
}

type IpageShellHeader = {
  primaryAction: () => void
  secondaryAction: () => void
  terciaryAction: () => void
}

type IpageDataBlockHeader = {
  primaryAction: () => void
  secondaryAction: () => void
}

function PageShellHeader({
  primaryAction,
  secondaryAction,
  terciaryAction,
}: IpageShellHeader) {
  return (
    <div className="pl-header-actions">
      <Button
        disabled
        type="button"
        variant="outline"
        onClick={primaryAction}
        className="pl-action-btn"
      >
        <Upload className="size-4" />
        Importar
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={secondaryAction}
        className="pl-action-btn"
      >
        <QrCode className="size-4" />
        <span>Link de auto-cadastro</span>
      </Button>
      <Button type="button" className="pl-primary-btn" onClick={terciaryAction}>
        <UserRoundPlus className="size-4" />
        <span>Cadastrar paciente</span>
      </Button>
    </div>
  )
}

function PageDataBlockHeader({
  primaryAction,
  secondaryAction,
}: IpageDataBlockHeader) {
  return (
    <>
      <Button
        disabled
        size="sm"
        type="button"
        variant="outline"
        onClick={primaryAction}
        className="pl-table-action-btn"
      >
        <Download className="size-3.5" />
        <span>Exportar</span>
      </Button>
      <Button
        disabled
        size="sm"
        type="button"
        variant="outline"
        onClick={secondaryAction}
        className="pl-table-action-btn"
      >
        <Columns3 className="size-3.5" />
        <span>Colunas</span>
      </Button>
    </>
  )
}

export function PatientsList() {
  const { setTitle } = useHeaderStore()

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [registerModalData, setRegisterModalData] = useState<IregisterModal>({
    isOpen: false,
    isEditing: false,
  })

  const { filters, setPage, setSort, clearFilters } = usePatientFilters()
  const { patients, meta, isLoading, isFetching } = usePatientsListQuery()
  const {
    activeCount,
    archivedCount,
    newPatientsCount,
    isLoading: loadingMetrics,
  } = usePatientsMetrics()

  const totalPatients = calcTotalPatients(meta.perPage, meta.totalCount)
  const filtersActive = hasActiveFilters(filters.filter, filters.status)

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
          <PageShellHeader
            primaryAction={() => {}}
            secondaryAction={() => setIsInviteOpen(true)}
            terciaryAction={() => setRegisterModalData({ isOpen: true })}
          />
        </PatientsPageShell.Header>

        <PatientsPageShell.Content>
          <div className="pl-metrics-grid">
            <MetricCard isLoading={isLoading}>
              <MetricCard.Icon bg="bg-blue-500/10">
                <UsersRound className="size-5 text-blue-600" />
              </MetricCard.Icon>
              <MetricCard.Value>{meta.totalCount}</MetricCard.Value>
              <MetricCard.Label>Total de pacientes</MetricCard.Label>
            </MetricCard>

            <MetricCard isLoading={loadingMetrics}>
              <MetricCard.Icon bg="bg-emerald-500/10">
                <Activity className="size-5 text-emerald-600" />
              </MetricCard.Icon>
              <MetricCard.Value>{activeCount}</MetricCard.Value>
              <MetricCard.Label>Ativos</MetricCard.Label>
              <MetricCard.Trend direction="up">24%</MetricCard.Trend>
            </MetricCard>

            <MetricCard isLoading={loadingMetrics}>
              <MetricCard.Icon bg="bg-red-500/10">
                <Clock className="size-5 text-red-500" />
              </MetricCard.Icon>
              <MetricCard.Value>{archivedCount}</MetricCard.Value>
              <MetricCard.Label>Arquivados</MetricCard.Label>
            </MetricCard>

            <MetricCard isLoading={loadingMetrics}>
              <MetricCard.Icon bg="bg-violet-500/10">
                <UserRoundPlus className="size-5 text-violet-600" />
              </MetricCard.Icon>
              <MetricCard.Value>{newPatientsCount}</MetricCard.Value>
              <MetricCard.Label>Novos (30 dias)</MetricCard.Label>
              <MetricCard.Trend direction="up">24%</MetricCard.Trend>
            </MetricCard>
          </div>

          <div className="pl-table-section">
            <PatientsDataBlock>
              <PatientsDataBlock.Header
                title="Lista de pacientes"
                description={formatPatientsShowing(
                  totalPatients,
                  meta.totalCount,
                )}
              >
                <PageDataBlockHeader
                  primaryAction={() => {}}
                  secondaryAction={() => {}}
                />
              </PatientsDataBlock.Header>

              <PatientsDataBlock.Toolbar>
                <PatientsTableFilters isFetching={isFetching} />
              </PatientsDataBlock.Toolbar>

              <PatientsDataBlock.Content>
                <PatientsTable
                  patients={patients}
                  isLoading={isLoading}
                  perPage={filters.perPage}
                  hasActiveFilters={filtersActive}
                  sort={{
                    by: filters.sortBy,
                    order: filters.order,
                    onSort: setSort,
                  }}
                  onClearFilters={clearFilters}
                  onRegister={() =>
                    setRegisterModalData({ isOpen: true, isEditing: true })
                  }
                />
              </PatientsDataBlock.Content>

              <PatientsDataBlock.Footer>
                <Pagination
                  pageIndex={meta.pageIndex}
                  totalCount={meta.totalCount}
                  perPage={meta.perPage}
                  onPageChange={setPage}
                />
              </PatientsDataBlock.Footer>
            </PatientsDataBlock>
          </div>
        </PatientsPageShell.Content>
      </PatientsPageShell>

      <Dialog
        open={registerModalData.isOpen}
        onOpenChange={() => setRegisterModalData({ isOpen: false })}
      >
        <RegisterPatients isEditing={registerModalData.isEditing} />
      </Dialog>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <GenerateInviteModal />
      </Dialog>
    </>
  )
}
