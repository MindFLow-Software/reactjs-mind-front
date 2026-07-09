import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { UserPlus } from 'lucide-react'

import { useHeaderStore } from '@/store/use-header-store'
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardSkeleton,
} from '@/pages/app/dashboard/shared/components/dashboard-states'
import { getGreeting } from '@/pages/app/dashboard/shared/helpers'
import { usePatientDashboard } from './hooks/use-patient-dashboard'
import { NextSessionCard } from './components/next-session-card'
import { MoodCheckIn } from './components/mood-check-in'
import { TherapeuticGoalsSection } from './components/therapeutic-goals-section'
import { RecentJournalSection } from './components/recent-journal-section'
import { PsychologistsSection } from './components/psychologists-section'
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
  const firstName = data.patientName.split(' ')[0]

  const renderState = () => {
    switch (state) {
      case 'loading':
        return <DashboardSkeleton variant="page" />
      case 'error':
        return <DashboardErrorState onRetry={refetch} />
      case 'empty':
        return (
          <DashboardEmptyState
            icon={UserPlus}
            title="Complete seu perfil de paciente"
            description="Você ainda não tem um perfil de paciente. Crie um para acompanhar suas sessões, metas e psicólogos."
            action={{ label: 'Ir para perfis', to: '/profiles' }}
          />
        )
      case 'ready':
        return (
          <>
            <header className="ptd-greeting">
              <h1 className="ptd-greeting-title">
                {getGreeting()}, {firstName}
              </h1>
              <p className="ptd-greeting-subtitle">
                Acompanhe sua jornada de bem-estar.
              </p>
            </header>

            <div className="ptd-grid">
              <div className="ptd-col-main">
                <NextSessionCard session={data.nextSession} />
                <TherapeuticGoalsSection goals={data.goals} />
                <RecentJournalSection entries={data.journal} />
              </div>

              <div className="ptd-col-side">
                <MoodCheckIn />
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

interface ResolveStateArgs {
  isLoading: boolean
  isError: boolean
  hasPatientProfile: boolean
}

function resolveState({
  isLoading,
  isError,
  hasPatientProfile,
}: ResolveStateArgs): PatientDashboardState {
  if (isLoading) return 'loading'
  if (isError) return 'error'
  if (!hasPatientProfile) return 'empty'
  return 'ready'
}
