import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartPulse, ArrowRight } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import { ProfileCard } from './profile-card'

import './patient-card.css'

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
          <h2 className="text-xl font-bold text-foreground">
            Criar perfil de paciente
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a plataforma para acompanhar seus atendimentos e sua jornada de
            cuidado.
          </p>
        </div>

        <ul className="pf-feature-list">
          <li className="pf-feature-item">
            <span className="pf-feature-dot pf-feature-dot--secondary" />
            Acompanhe consultas
          </li>
          <li className="pf-feature-item">
            <span className="pf-feature-dot pf-feature-dot--secondary" />
            Veja informações dos atendimentos
          </li>
          <li className="pf-feature-item">
            <span className="pf-feature-dot pf-feature-dot--secondary" />
            Organize sua jornada de saúde mental
          </li>
        </ul>

        {existingCount > 0 && (
          <p className="pf-hint text-muted-foreground">
            Você já possui {existingCount}{' '}
            {existingCount === 1 ? 'perfil' : 'perfis'} de paciente vinculado
            {existingCount === 1 ? '' : 's'}.
          </p>
        )}
      </ProfileCard.Content>

      <ProfileCard.Footer>
        <Button
          className="pf-cta-btn pf-cta-btn--secondary"
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
