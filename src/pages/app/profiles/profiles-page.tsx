import { useCallback, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Plus,
  Brain,
  Loader2,
  Briefcase,
  UserRound,
  HeartPulse,
  ArrowRight,
} from 'lucide-react'

import { getProfile } from '@/api/psychologists/get-profile'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { PatientProfileCard } from './components/patient-profile-card'
import { PracticeContextCard } from './components/practice-context-card'

function ProfilesShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-4xl">{children}</div>
    </div>
  )
}

function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/80">
        {icon}
        <span>{title}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function ProfilesPage() {
  const navigate = useNavigate()

  const setActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.setActivePracticeContextId,
  )

  const clearActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.clearActivePracticeContextId,
  )

  const {
    data: me,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['me'], queryFn: getProfile })

  const handleSelectContext = useCallback(
    (id: string) => {
      setActivePracticeContextId(id)
      navigate('/dashboard')
    },
    [setActivePracticeContextId, navigate],
  )

  const handleSelectPatient = useCallback(() => {
    clearActivePracticeContextId()
    navigate('/patient-dashboard')
  }, [clearActivePracticeContextId, navigate])

  const handleRedirectToCreateProfile = (type: 'psychologist' | 'pacient') => {
    navigate(`/onboarding/${type}`)
  }

  const handleRedirectToCreateContext = () => {
    navigate('/profiles/context')
  }

  const handleRedirectClaimCandidates = () => {
    navigate('/profiles/claim-candidates')
  }

  const hasPsychologistProfile = Boolean(me?.psychologistProfile)

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
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {me.firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha um perfil para continuar ou crie um novo.
        </p>
      </header>

      <div className="flex gap-4 mb-4">
        <Card className="relative max-w-1/2 p-4 gap-1">
          <div className="absolute left-0 top-0 h-1 w-full bg-blue-500" />
          <CardHeader className="p-0">
            <div className="flex items-center justify-center p-3 w-fit rounded-md text-white bg-blue-500/75">
              <Brain size={24} />
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground">
              Para profissionais licenciados
            </span>
          </CardHeader>
          <CardContent className="p-0 space-y-3 mb-8">
            <CardTitle className="text-xl">Perfil de psicólogo</CardTitle>
            <CardDescription className="text-xs">
              Crie sua identidade profissional uma única vez — depois adicione
              quantos contextos de prática precisar (consultório particular,
              clínicas).
            </CardDescription>
            <ul className="space-y-2 flex-1">
              <li className="text-sm">- CRP e credenciais (pagamento único)</li>
              <li className="text-sm">
                - Adicione vários espaços de trabalho posteriormente
              </li>
              <li className="text-sm">
                - Ferramentas para prática calma e focada
              </li>
            </ul>
          </CardContent>
          <CardFooter className="p-0 mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRedirectToCreateProfile('psychologist')}
              className="justify-between bg-transparent border-none flex-1"
            >
              Criar perfil de psicólogo
              <div className="flex items-center justify-center p-3 w-fit rounded-full bg-neutral-200">
                <ArrowRight className="size-4" />
              </div>
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative max-w-1/2 p-4 gap-1">
          <div className="absolute left-0 top-0 h-1 w-full bg-emerald-500" />
          <CardHeader className="p-0">
            <div className="flex items-center justify-center p-3 w-fit rounded-md text-white bg-emerald-500/75">
              <HeartPulse size={24} />
            </div>
            <span className="mt-2 text-sm font-medium text-muted-foreground">
              Para o seu bem-estar
            </span>
          </CardHeader>
          <CardContent className="p-0 space-y-3 mb-8">
            <CardTitle className="text-xl">Perfil de paciente</CardTitle>
            <CardDescription className="text-xs">
              Encontre o psicólogo certo, acompanhe sua jornada de saúde mental
              e cuide de si mesmo com carinho.
            </CardDescription>
            <ul className="space-y-2 flex-1">
              <li className="text-sm">- Encontre seu psicólogo</li>
              <li className="text-sm">- Acompanhe sua jornada</li>
              <li className="text-sm">- Reflexões pessoais</li>
            </ul>
          </CardContent>
          <CardFooter className="p-0 mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRedirectToCreateProfile('pacient')}
              className="justify-between bg-transparent border-none flex-1"
            >
              Criar perfil de paciente
              <div className="flex items-center justify-center p-3 w-fit rounded-full bg-neutral-200">
                <ArrowRight className="size-4" />
              </div>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {me.practiceContexts.length > 0 && (
        <ProfileSection
          title="Contextos de atendimento"
          icon={<Briefcase className="size-4 text-blue-600" />}
        >
          {me.practiceContexts.map((context) => (
            <PracticeContextCard
              key={context.id}
              context={context}
              onSelect={handleSelectContext}
            />
          ))}
        </ProfileSection>
      )}

      {me.patientProfiles.length > 0 && (
        <ProfileSection
          title="Perfis de paciente"
          icon={<UserRound className="size-4 text-violet-600" />}
        >
          {me.patientProfiles.map((profile) => (
            <PatientProfileCard
              key={profile.id}
              profile={profile}
              onSelect={handleSelectPatient}
            />
          ))}
        </ProfileSection>
      )}

      <ProfileSection
        title="Possíveis vínculos"
        icon={<UserRound className="size-4 text-violet-600" />}
      >
        <Button onClick={handleRedirectClaimCandidates}>Ver candidatos</Button>
      </ProfileSection>

      {hasPsychologistProfile && (
        <div>
          <Button className="gap-2" onClick={handleRedirectToCreateContext}>
            <Plus />
            Adicionar Contexto de atuação
          </Button>
        </div>
      )}
    </ProfilesShell>
  )
}
