import { memo } from 'react'
import { HeartPulse, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import './patient-card.css'

interface PatientCardProps {
  existingCount: number
  onCreateProfile: () => void
}

function PatientCardBase({ existingCount, onCreateProfile }: PatientCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="pat-card">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-teal-600" />

        <div className="pat-eyebrow mt-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400">
            <HeartPulse className="size-5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Para o seu cuidado
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Criar perfil de paciente
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a plataforma para acompanhar seus atendimentos e sua jornada de
            cuidado.
          </p>
        </div>

        <ul className="pat-features">
          <li className="pat-feature-item text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
            Acompanhe consultas
          </li>
          <li className="pat-feature-item text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
            Veja informações dos atendimentos
          </li>
          <li className="pat-feature-item text-muted-foreground">
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

        <div className="pat-actions">
          <Button
            className="w-full bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-950/30"
            onClick={onCreateProfile}
          >
            Criar perfil de paciente
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export const PatientCard = memo(PatientCardBase)
