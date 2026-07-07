import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2, LogOut } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { useSignOut } from '@/hooks/use-sign-out'

import { Button } from '@/components/ui/button'

import { ProfileSectionHeader } from './components/profile-section-header'
import { PatientProfileSection } from './components/patient-profile-section'
import { PsychologistProfileCard } from '../account/components/psychologist-profile-card'
import { CreatePatientProfileCard } from './components/create-patient-profile-card'
import { PsychologistPracticeContextsSection } from './components/psychologist-practice-contexts-section'
import { PatientProfilePossibleCandidatesSection } from './components/patient-profile-possible-candidates-section'

import './profiles-page.css'

function ProfilesLayout({
  children,
  greeting = 'Olá',
}: {
  children: ReactNode
  greeting?: string
}) {
  const { signOut } = useSignOut()

  return (
    <div className="pf-layout">
      <div className="flex w-full max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => signOut()}
        >
          <LogOut size={16} className="rotate-180" />
        </Button>
        <header className="pf-layout-header">
          <h1 className="pf-layout-greeting">{greeting}</h1>
          <p className="text-sm text-muted-foreground">
            Escolha como deseja usar a plataforma ou continue em um perfil já
            existente.
          </p>
          <p className="text-sm text-muted-foreground">
            Você pode usar a plataforma como psicólogo, paciente ou ambos.
          </p>
        </header>
      </div>

      <main className="pf-layout-main">{children}</main>
    </div>
  )
}

function ProfilesShell({ children }: { children: ReactNode }) {
  const { isError, profile: me, isPending: isLoading } = useAuth()

  if (isLoading) {
    return (
      <ProfilesLayout>
        <div className="pf-loading-state">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </ProfilesLayout>
    )
  }

  if (isError || !me) {
    return (
      <ProfilesLayout>
        <p className="pf-error-state">
          Não foi possível carregar seus perfis. Tente novamente.
        </p>
      </ProfilesLayout>
    )
  }

  if (me.platformRole === 'ADMIN') {
    return <Navigate to="/admin-dashboard" replace />
  }

  return (
    <ProfilesLayout greeting={`Olá, ${me.firstName}`}>
      {children}
    </ProfilesLayout>
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
          <PsychologistProfileCard />
          <CreatePatientProfileCard />
        </div>
      </section>

      <PsychologistPracticeContextsSection />
      <PatientProfileSection />
      <PatientProfilePossibleCandidatesSection />
    </ProfilesShell>
  )
}
