import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartPulse, ArrowRight } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import { ProfileCard } from './profile-card'

function PatientCardBase() {
  const navigate = useNavigate()
  const { profile: me } = useAuth()

  const existingCount = me?.patientProfiles.length ?? 0

  const handleCreatePatientProfile = () => {
    navigate('/onboarding/patient')
  }

  return (
    <ProfileCard.Root>
      <ProfileCard.Header
        variant="secondary"
        icon={<HeartPulse />}
        label="Para o seu cuidado"
      />
      <ProfileCard.Content>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Criar perfil de paciente
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a plataforma para acompanhar seus atendimentos e sua jornada de
            cuidado.
          </p>
        </div>

        <ul className="space-y-2">
          <li className="flex gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
            Acompanhe consultas
          </li>
          <li className="flex gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
            Veja informações dos atendimentos
          </li>
          <li className="flex gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
            Organize sua jornada de saúde mental
          </li>
        </ul>

        {existingCount > 0 && (
          <p className="pat-hint text-muted-foreground">
            Você já possui {existingCount}{' '}
            {existingCount === 1 ? 'perfil' : 'perfis'} de paciente vinculado
            {existingCount === 1 ? '' : 's'}.
          </p>
        )}
      </ProfileCard.Content>

      <ProfileCard.Footer>
        <Button
          className="flex items-center gap-2 w-full bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-950/30"
          onClick={handleCreatePatientProfile}
        >
          Criar perfil de paciente
          <ArrowRight size={16} />
        </Button>
      </ProfileCard.Footer>
    </ProfileCard.Root>
  )
}

export const PatientCard = memo(PatientCardBase)
