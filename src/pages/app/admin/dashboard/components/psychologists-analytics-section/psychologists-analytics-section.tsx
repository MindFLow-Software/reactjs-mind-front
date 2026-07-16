import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'
import { sumDailyCounts } from '@/pages/app/dashboard/shared/helpers'
import type { IAdminDashboardData } from '@/types/dashboard/admin-dashboard-data'

import { AdminAnalyticsSubject } from '../../constants'
import { AgeRangeChart } from '../age-range-chart/age-range-chart'
import { SpecialtiesChart } from '../specialties-chart/specialties-chart'
import { GenderDistributionChart } from '../gender-distribution-chart/gender-distribution-chart'
import { StateDistributionChart } from '../state-distribution-chart/state-distribution-chart'
import { PsychologistsActivityCard } from '../psychologists-activity-card/psychologists-activity-card'

import './psychologists-analytics-section.css'

type IAdminDashboardPsychologists = IAdminDashboardData['psychologists']

type IPsychologistsAnalyticsSection = {
  psychologists: IAdminDashboardPsychologists
}

export function PsychologistsAnalyticsSection({
  psychologists,
}: IPsychologistsAnalyticsSection) {
  const stateTotal = sumDailyCounts(psychologists.byState)

  return (
    <DashboardSection
      header={{
        index: '05',
        title: 'Análise de psicólogos',
        description:
          'Perfil demográfico, atividade e especialidades dos profissionais',
      }}
    >
      <div className="adb-psy-analytics-charts">
        <PsychologistsActivityCard
          active={psychologists.active}
          inactive={psychologists.inactive}
        />
        <AgeRangeChart
          subject={AdminAnalyticsSubject.PSYCHOLOGISTS}
          data={psychologists.byAge}
        />
        <GenderDistributionChart
          subject={AdminAnalyticsSubject.PSYCHOLOGISTS}
          data={psychologists.byGender}
        />
      </div>

      <div className="adb-psy-analytics-distribution">
        <StateDistributionChart
          description="Psicólogos ativos por unidade federativa"
          total={stateTotal}
        />
        <SpecialtiesChart data={psychologists.specialties} />
      </div>
    </DashboardSection>
  )
}
