import { useCallback, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { getProfile } from '@/api/psychologists/get-profile'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import { PsychologistCard } from './components/psychologist-card'
import { PatientCard } from './components/patient-card'
import { PsychologistProfileSection } from './components/psychologist-profile-section'
import { PatientProfileSection } from './components/patient-profile-section'
import './profiles-page.css'

function ProfilesShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-6xl">{children}</div>
    </div>
  )
}

export function ProfilesPage() {
  const navigate = useNavigate()

  const setActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.setActivePracticeContextId,
  )

  const {
    data: me,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['me'], queryFn: getProfile })

  const handleEnterPsychologistProfile = useCallback(() => {
    if (!me) return
    const { practiceContexts } = me
    if (practiceContexts.length === 1) {
      setActivePracticeContextId(practiceContexts[0].id)
      navigate('/dashboard')
    } else {
      navigate('/profiles/context')
    }
  }, [me, navigate, setActivePracticeContextId])

  const handleAddContext = useCallback(() => {
    navigate('/profiles/context')
  }, [navigate])

  const handleCreatePsychologistProfile = useCallback(() => {
    navigate('/onboarding/psychologist')
  }, [navigate])

  const handleCreatePatientProfile = useCallback(() => {
    navigate('/onboarding/patient')
  }, [navigate])

  const handleEnterPatientProfile = useCallback(
    (_id: string) => {
      navigate('/patient-dashboard')
    },
    [navigate],
  )

  if (isLoading) {
    return (
      <ProfilesShell>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </ProfilesShell>
    )
  }

  if (isError || !me) {
    return (
      <ProfilesShell>
        <p className="py-20 text-center text-sm text-muted-foreground">
          Não foi possível carregar seus perfis. Tente novamente.
        </p>
      </ProfilesShell>
    )
  }

  if (me.platformRole === 'ADMIN') {
    return <Navigate to="/admin-dashboard" replace />
  }

  return (
    <ProfilesShell>
      <div className="pp-greeting">
        <h1 className="pp-greeting-title text-foreground">
          Olá, {me.firstName}
        </h1>
        <p className="pp-greeting-subtitle text-muted-foreground">
          Escolha como deseja usar a plataforma ou continue em um perfil já
          existente.
        </p>
        <p className="pp-greeting-hint text-muted-foreground">
          Você pode usar a plataforma como psicólogo, paciente ou ambos.
        </p>
      </div>

      <div className="pp-header">
        <span className="pp-eyebrow text-muted-foreground">COMEÇAR</span>
        <h1 className="pp-title text-foreground">
          Começar ou adicionar novo perfil
        </h1>
        <p className="pp-subtitle text-muted-foreground">
          Crie um perfil novo ou adicione um novo contexto de atuação.
        </p>
      </div>

      <div className="pp-grid">
        <PsychologistCard
          profile={me.psychologistProfile}
          practiceContexts={me.practiceContexts}
          firstName={me.firstName}
          lastName={me.lastName}
          isActive={me.isActive}
          onEnter={handleEnterPsychologistProfile}
          onAddContext={handleAddContext}
          onCreateProfile={handleCreatePsychologistProfile}
        />
        <PatientCard
          existingCount={me.patientProfiles.length}
          onCreateProfile={handleCreatePatientProfile}
        />
      </div>

      {me.psychologistProfile && (
        <PsychologistProfileSection
          profile={me.psychologistProfile}
          practiceContexts={me.practiceContexts}
          firstName={me.firstName}
          lastName={me.lastName}
          isActive={me.isActive}
          onEnter={handleEnterPsychologistProfile}
          onAddContext={handleAddContext}
        />
      )}

      <PatientProfileSection
        profiles={me.patientProfiles}
        onEnter={handleEnterPatientProfile}
      />
    </ProfilesShell>
  )
}
