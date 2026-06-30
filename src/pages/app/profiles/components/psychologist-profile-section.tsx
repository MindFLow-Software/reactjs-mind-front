import { useQuery } from '@tanstack/react-query'
import { Brain, ArrowRight, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getActivePatientProfilesAmount } from '@/api/patient-profiles/get-active-patient-profiles-amount'
import type { PsychologistProfile } from '@/types/psychologist'
import type { PracticeContextMe } from '../constants'
import { PracticeContextCard } from './practice-context-card'
import './psychologist-profile-section.css'

interface PsychologistProfileSectionProps {
  profile: PsychologistProfile
  practiceContexts: PracticeContextMe[]
  firstName: string
  lastName: string
  isActive: boolean
  onEnter: () => void
  onAddContext: () => void
  onSelectContext: (id: string) => void
}

interface StatProps {
  label: string
  value: number | undefined
  isLoading?: boolean
}

function Stat({ label, value, isLoading }: StatProps) {
  return (
    <div className="pps-stat">
      <span className="pps-stat-label text-muted-foreground">{label}</span>
      {isLoading ? (
        <Skeleton className="mt-1 h-8 w-8" />
      ) : (
        <span className="pps-stat-value text-foreground">{value ?? '—'}</span>
      )}
    </div>
  )
}

export function PsychologistProfileSection({
  profile,
  practiceContexts,
  firstName,
  lastName,
  isActive,
  onEnter,
  onAddContext,
  onSelectContext,
}: PsychologistProfileSectionProps) {
  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['patients-metrics-active'],
    queryFn: getActivePatientProfilesAmount,
  })

  return (
    <div className="pps-wrapper">
      <div>
        <div className="pps-section-header">
          <span className="pps-eyebrow text-muted-foreground">PROFISSIONAL</span>
          <h2 className="pps-section-title text-foreground">
            Seu perfil de psicólogo
          </h2>
          <p className="pps-section-subtitle text-muted-foreground">
            Acesse seu ambiente profissional e gerencie sua atuação.
          </p>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="pps-card-content">
            <div className="pps-card-left">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                <Brain className="size-5" />
              </div>

              <div className="pps-card-left-info">
                <div className="pps-name-row">
                  <span className="text-lg font-bold text-foreground">
                    {firstName} {lastName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'size-2 rounded-full',
                        isActive ? 'bg-green-500' : 'bg-red-400',
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isActive
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-500 dark:text-red-400',
                      )}
                    >
                      {isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                <span className="text-sm text-muted-foreground">
                  {profile.crp}
                </span>

                <span className="mt-1 text-sm text-muted-foreground">
                  Seu perfil está pronto para atender em diferentes contextos.
                </span>
              </div>
            </div>

            <div className="pps-card-right">
              <Stat label="CONTEXTOS" value={practiceContexts.length} />
              <Stat
                label="PACIENTES"
                value={metricsData?.amount}
                isLoading={isLoadingMetrics}
              />
            </div>
          </div>

          <Separator />

          <div className="pps-card-actions">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-950/30"
              onClick={onEnter}
            >
              Entrar no perfil de psicólogo
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline" onClick={onAddContext}>
              <Plus className="mr-2 size-4" />
              Adicionar contexto
            </Button>
          </div>
        </Card>
      </div>

      {practiceContexts.length > 0 && (
        <div>
          <div className="pps-contexts-header">
            <span className="pps-contexts-eyebrow text-muted-foreground">
              CONTEXTOS
            </span>
          </div>
          <div className="pps-contexts-grid">
            {practiceContexts.map((context) => (
              <PracticeContextCard
                key={context.id}
                context={context}
                onSelect={onSelectContext}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
