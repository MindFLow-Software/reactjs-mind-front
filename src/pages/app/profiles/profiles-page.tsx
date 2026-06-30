import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'

import { PatientCard } from './components/patient-card'
import { PsychologistCard } from './components/psychologist-card'
import { ProfileSectionHeader } from './components/profile-section-header'
import { PsychologistPracticeContextsSection } from './components/psychologist-practice-contexts-section'
import { PatientProfileSection } from './components/patient-profile-section'
import { PatientProfilePossibleCandidatesSection } from './components/patient-profile-possible-candidates-section'

function ProfilesShell({ children }: { children: ReactNode }) {
  const {
    isError,
    profile: me,
    isPending: isLoading,
  } = useAuth()

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
    <div className="min-h-screen w-full bg-background py-10">
      <header className="text-center mb-8">
        <h1 className="text-4xl text-foreground">
          Olá, {me.firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Escolha como deseja usar a plataforma ou continue em um perfil já
          existente.
        </p>
        <p className="text-sm text-muted-foreground">
          Você pode usar a plataforma como psicólogo, paciente ou ambos.
        </p>
      </header>

      <main className="mx-auto flex flex-col justify-center items-center gap-8 w-full max-w-4xl">
        {children}
      </main>
    </div>
  )
}

export function ProfilesPage() {
  return (
    <ProfilesShell>
      <section className="w-full">
        <ProfileSectionHeader
          section="começar"
          title="Começar ou adicionar novo perfil"
          label="Crie um perfil novo ou adicione um novo contexto de atuação."
        />

        <div className="flex justify-center gap-4">
          <PsychologistCard />
          <PatientCard />
        </div>
      </section>

      <PsychologistPracticeContextsSection />
      <PatientProfileSection />
      <PatientProfilePossibleCandidatesSection />
    </ProfilesShell>
  )
}
