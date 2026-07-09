import { useCallback } from 'react'
import { toast } from 'sonner'
import { Star } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Currency } from '@/utils/currency'
import type { IPatientPsychologistCard } from '../types'
import './psychologists-section.css'

export interface PsychologistsSectionProps {
  psychologists: IPatientPsychologistCard[]
}

const SECTION_TITLE_BY_MODE: Record<'linked' | 'recommended', string> = {
  linked: 'Meus psicólogos',
  recommended: 'Psicólogos recomendados',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function PsychologistsSection({
  psychologists,
}: PsychologistsSectionProps) {
  const handleAction = useCallback(() => {
    toast.info('Ação ainda não disponível nesta versão.')
  }, [])

  const mode = psychologists.some((psychologist) => psychologist.isLinked)
    ? 'linked'
    : 'recommended'

  return (
    <Card className="ptd-psychologists-card">
      <span className="ptd-psychologists-title">
        {SECTION_TITLE_BY_MODE[mode]}
      </span>

      <div className="ptd-psychologists-list">
        {psychologists.map((psychologist) => (
          <div key={psychologist.id} className="ptd-psychologist-item">
            <Avatar className="ptd-psychologist-avatar">
              <AvatarFallback>{getInitials(psychologist.name)}</AvatarFallback>
            </Avatar>

            <div className="ptd-psychologist-info">
              <span className="ptd-psychologist-name">{psychologist.name}</span>
              <span className="ptd-psychologist-specialty">
                {psychologist.specialty}
              </span>
              <div className="ptd-psychologist-meta">
                <Badge variant="secondary" className="ptd-psychologist-badge">
                  <Star className="size-3" />
                  {psychologist.rating.toFixed(1)}
                </Badge>
                <span className="ptd-psychologist-price">
                  {Currency.toBRL(psychologist.pricePerSession)}
                </span>
              </div>
            </div>

            <Button
              variant={psychologist.isLinked ? 'outline' : 'default'}
              className="ptd-psychologist-action"
              onClick={handleAction}
            >
              {psychologist.isLinked ? 'Ver perfil' : 'Vincular'}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
