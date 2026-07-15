import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { UserPlus } from 'lucide-react'

import { getGreeting } from '@/pages/app/dashboard/shared/helpers'
import { useHeaderStore } from '@/store/use-header-store'
import { usePatientDashboard } from './hooks/use-patient-dashboard'

import { DashboardSkeleton } from '@/pages/app/dashboard/shared/components/dashboard-skeleton/dashboard-skeleton'
import { DashboardEmptyState } from '@/pages/app/dashboard/shared/components/dashboard-empty-state/dashboard-empty-state'
import { DashboardErrorState } from '@/pages/app/dashboard/shared/components/dashboard-error-state/dashboard-error-state'

import { MoodCheckIn } from './components/mood-check-in/mood-check-in'
import { NextSessionCard } from './components/next-session-card/next-session-card'
import { PsychologistsSection } from './components/psychologists-section/psychologists-section'
import { RecentJournalSection } from './components/recent-journal-section/recent-journal-section'
import { TherapeuticGoalsSection } from './components/therapeutic-goals-section/therapeutic-goals-section'

import './patient-dashboard.css'

type PatientDashboardState = 'loading' | 'error' | 'empty' | 'ready'

export function PatientDashboard() {
  const { setTitle } = useHeaderStore()
  const { data, hasPatientProfile, isLoading, isError, refetch } =
    usePatientDashboard()

  useEffect(() => {
    setTitle('Meu espaço')
  }, [setTitle])

  const state = resolveState({ isLoading, isError, hasPatientProfile })
  const fullName = data.patientName

  const renderState = () => {
    switch (state) {
      case 'loading':
        return <DashboardSkeleton variant="page" />
      case 'error':
        return <DashboardErrorState onRetry={refetch} />
      case 'empty':
        return (
          <DashboardEmptyState
            content={{
              icon: UserPlus,
              title: 'Complete seu perfil de paciente',
              description:
                'Você ainda não tem um perfil de paciente. Crie um para acompanhar suas sessões, metas e psicólogos.',
            }}
            action={{ label: 'Ir para perfis', to: '/profiles' }}
          />
        )
      case 'ready':
        return (
          <>
            <header className="ptd-greeting">
              <h1 className="ptd-greeting-title">
                {getGreeting()}, {fullName}
              </h1>
              <p className="ptd-greeting-subtitle">
                Acompanhe sua jornada de bem-estar.
              </p>
            </header>

            <div className="ptd-content">
              <div className="ptd-row">
                <NextSessionCard session={data.nextSession} />
                <MoodCheckIn />
              </div>

              <div className="ptd-row">
                <TherapeuticGoalsSection goals={data.goals} />
                <RecentJournalSection entries={data.journal} />
              </div>

              <div className="ptd-row">
                <PsychologistsSection psychologists={data.psychologists} />
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <>
      <Helmet title="Meu espaço" />

      <div className="ptd-root">{renderState()}</div>
    </>
  )
}

type IResolveState = {
  isLoading: boolean
  isError: boolean
  hasPatientProfile: boolean
}

function resolveState({
  isLoading,
  isError,
  hasPatientProfile,
}: IResolveState): PatientDashboardState {
  if (isLoading) return 'loading'
  if (isError) return 'error'
  if (!hasPatientProfile) return 'empty'
  return 'ready'
}
