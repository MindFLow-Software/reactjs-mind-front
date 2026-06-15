import { useCallback, useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { Briefcase, Loader2, Plus, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProfile } from '@/api/psychologists/get-profile'
import { createPatientProfile } from '@/api/auth/create-patient-profile'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import { PracticeContextCard } from './components/practice-context-card'
import { PatientProfileCard } from './components/patient-profile-card'
import { CreatePsychologistSubFlow } from './components/create-psychologist-sub-flow'

function ProfilesShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-3xl">{children}</div>
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
  const queryClient = useQueryClient()
  const setActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.setActivePracticeContextId,
  )
  const clearActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.clearActivePracticeContextId,
  )
  const [subFlowOpen, setSubFlowOpen] = useState(false)

  const {
    data: me,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['me'], queryFn: getProfile })

  const { mutateAsync: createPatientFn, isPending: isCreatingPatient } =
    useMutation({ mutationFn: createPatientProfile })

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

  const handleCreatePatient = useCallback(async () => {
    try {
      clearActivePracticeContextId()
      await createPatientFn({ psychologistPracticeContextId: null })
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate('/patient-dashboard')
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.message
          : 'Erro ao criar perfil de paciente.',
      )
    }
  }, [createPatientFn, clearActivePracticeContextId, queryClient, navigate])

  const handleOpenSubFlow = useCallback(() => setSubFlowOpen(true), [])

  const handlePsychologistCreated = useCallback(
    (contextId: string) => {
      setActivePracticeContextId(contextId)
      navigate('/dashboard')
    },
    [setActivePracticeContextId, navigate],
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
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {me.firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha um perfil para continuar ou crie um novo.
        </p>
      </header>

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenSubFlow}
          className="flex-1"
        >
          <Plus className="size-4" /> Criar perfil de psicólogo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCreatePatient}
          disabled={isCreatingPatient}
          className="flex-1"
        >
          {isCreatingPatient ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}{' '}
          Criar perfil de paciente
        </Button>
      </div>

      <CreatePsychologistSubFlow
        open={subFlowOpen}
        onOpenChange={setSubFlowOpen}
        onCreated={handlePsychologistCreated}
      />
    </ProfilesShell>
  )
}
