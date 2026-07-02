import './patient-card.css'

import { memo } from 'react'
import { HeartPulse, ArrowRight, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ProfileCard } from './profile-card'

interface PatientCardProps {
  existingCount: number
  onCreateProfile: () => void
}

function PatientCardBase({ existingCount, onCreateProfile }: PatientCardProps) {
  return (
    <ProfileCard variant="secondary">
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

        <ul className="space-y-2">
          <li className="flex gap-2 items-center text-sm text-muted-foreground">
            <span className="pat-feat-check bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
              <Check size={13} strokeWidth={2.5} className="text-green-600" />
            </span>
            Acompanhe consultas
          </li>
          <li className="flex gap-2 items-center text-sm text-muted-foreground">
            <span className="pat-feat-check bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
              <Check size={13} strokeWidth={2.5} className="text-green-600" />
            </span>
            Veja informações dos atendimentos
          </li>
          <li className="flex gap-2 items-center text-sm text-muted-foreground">
            <span className="pat-feat-check bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
              <Check size={13} strokeWidth={2.5} className="text-green-600" />
            </span>
            Organize sua jornada de saúde mental
          </li>
        </ul>

        {existingCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Você já possui {existingCount}{' '}
            {existingCount === 1 ? 'perfil' : 'perfis'} vinculado
            {existingCount === 1 ? '' : 's'}.
          </p>
        )}
      </ProfileCard.Content>

      <ProfileCard.Footer>
        <Button
          className="w-full group bg-green-600 hover:bg-green-700 text-white"
          onClick={onCreateProfile}
        >
          Criar perfil de paciente
          <ArrowRight
            size={16}
            className="group-hover:translate-x-[3px] transition-transform duration-150"
          />
        </Button>
      </ProfileCard.Footer>
    </ProfileCard>
  )
}

export const PatientCard = memo(PatientCardBase)
