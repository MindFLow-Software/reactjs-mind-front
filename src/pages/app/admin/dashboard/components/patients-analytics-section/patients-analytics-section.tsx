import { UserRound } from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { IAdminDashboardData } from '@/types/dashboard/admin-dashboard-data'

import { AdminAnalyticsSubject } from '../../constants'
import { AgeRangeChart } from '../age-range-chart/age-range-chart'
import {
  AdminStatCard,
  AdminStatAccent,
} from '../admin-stat-card/admin-stat-card'
import { GenderDistributionChart } from '../gender-distribution-chart/gender-distribution-chart'
import { StateDistributionChart } from '../state-distribution-chart/state-distribution-chart'
import { PatientsGeographyChart } from '../patients-geography-chart/patients-geography-chart'

import './patients-analytics-section.css'

type IAdminDashboardPatients = IAdminDashboardData['patients']

type IPatientsAnalyticsSection = {
  patients: IAdminDashboardPatients
}

export function PatientsAnalyticsSection({
  patients,
}: IPatientsAnalyticsSection) {
  const regionTotal = sumDailyCounts(patients.byRegion)

  return (
    <DashboardSection
      header={{
        index: '06',
        title: 'Pacientes',
        description:
          'Total ativo na plataforma e perfil demográfico dos pacientes',
      }}
    >
      <div className="adb-pat-analytics-metric">
        <AdminStatCard accent={AdminStatAccent.BLUE}>
          <AdminStatCard.Header
            icon={<UserRound className="size-4" />}
            title="Pacientes ativos"
            subtitle="Cadastrados na plataforma"
          />
          <AdminStatCard.Value>
            {patients.total.toLocaleString('pt-BR')}
          </AdminStatCard.Value>
        </AdminStatCard>
      </div>

      <div className="adb-pat-analytics-charts">
        <AgeRangeChart
          subject={AdminAnalyticsSubject.PATIENTS}
          data={patients.byAge}
        />

        <GenderDistributionChart
          subject={AdminAnalyticsSubject.PATIENTS}
          data={patients.byGender}
        />

        <StateDistributionChart
          description="Pacientes ativos por unidade federativa"
          total={regionTotal}
        />

        {/* <PatientsGeographyChart data={patients.byRegion} /> */}
      </div>
    </DashboardSection>
  )
}
