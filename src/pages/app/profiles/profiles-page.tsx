import './profiles-page.css'

import { useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import { ProfileSectionHeader } from './components/profile-section-header'
import { PsychologistCard } from './components/psychologist-card'
import { PatientCard } from './components/patient-card'
import { PsychologistPracticeContextsSection } from './components/psychologist-practice-contexts-section'
import { PatientProfileSection } from './components/patient-profile-section'
import { PatientProfilePossibleCandidatesSection } from './components/patient-profile-possible-candidates-section'

export function ProfilesPage() {
  const navigate = useNavigate()
  const { isError, profile: me, isPending } = useAuth()
  const { setActivePracticeContextId } = useActivePracticeContextStore()

  const handleEnterPsychologist = useCallback(() => {
    if (!me) return
    if (me.practiceContexts.length === 0) {
      navigate('/profiles/context')
    } else if (me.practiceContexts.length === 1) {
      setActivePracticeContextId(me.practiceContexts[0].id)
      navigate('/dashboard')
    } else {
      navigate('/profiles/contexts')
    }
  }, [me, navigate, setActivePracticeContextId])

  const handleAddContext = useCallback(
    () => navigate('/profiles/context'),
    [navigate],
  )

  const handleCreatePsychologistProfile = useCallback(
    () => navigate('/onboarding/psychologist'),
    [navigate],
  )

  const handleCreatePatientProfile = useCallback(
    () => navigate('/onboarding/patient'),
    [navigate],
  )

  if (isPending) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  if (isError || !me) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar seus perfis. Tente novamente.
        </p>
      </div>
    )
  }

  if (me.platformRole === 'ADMIN') {
    return <Navigate to="/admin-dashboard" replace />
  }

  return (
    <div className="pp-shell">
      <main className="pp-gutter pp-content">
        <div className="pp-hero">
          <h1 className="pp-title">Olá, {me.firstName}</h1>
          <p className="pp-sub">
            Escolha como deseja usar a plataforma ou continue em um perfil já
            existente.
          </p>
        </div>

        <section className="pp-section">
          <ProfileSectionHeader
            section="começar"
            title="Começar ou adicionar novo perfil"
            label="Crie um perfil novo ou adicione um novo contexto de atuação."
          />
          <div className="pp-grid">
            <PsychologistCard
              profile={me.psychologistProfile}
              practiceContexts={me.practiceContexts}
              onEnter={handleEnterPsychologist}
              onAddContext={handleAddContext}
              onCreateProfile={handleCreatePsychologistProfile}
            />
            <PatientCard
              existingCount={me.patientProfiles.length}
              onCreateProfile={handleCreatePatientProfile}
            />
          </div>
        </section>

        <div className="pp-section">
          <PsychologistPracticeContextsSection />
        </div>

        <div className="pp-section">
          <PatientProfileSection />
        </div>

        <section className="pp-section">
          <ProfileSectionHeader
            section="vínculos"
            title="Possíveis vínculos de perfil"
            label="Confira possíveis perfis de paciente vinculados aos seus dados e associe-os à sua conta, se necessário."
          />
          <PatientProfilePossibleCandidatesSection />
        </section>
      </main>
    </div>
  )
}
