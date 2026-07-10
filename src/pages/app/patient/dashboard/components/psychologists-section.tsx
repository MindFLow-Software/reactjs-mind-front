import { useCallback } from 'react'
import { toast } from 'sonner'
import { Star } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Currency } from '@/utils/currency'
import type { IPatientPsychologistCard } from '../types'
import './psychologists-section.css'

export interface IPsychologistsSection {
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
}: IPsychologistsSection) {
  const handleAction = useCallback(() => {
    toast.info('Ação ainda não disponível nesta versão.')
  }, [])

  const mode = psychologists.some((psychologist) => psychologist.isLinked)
    ? 'linked'
    : 'recommended'

  return (
    <div className="ptd-psychologists-content">
      <span className="ptd-psychologists-title">
        {SECTION_TITLE_BY_MODE[mode]}
      </span>

      <div className="ptd-psychologists-list">
        {[...psychologists, ...psychologists].map((psychologist) => (
          <Card key={psychologist.id} className="ptd-psychologist-card">
            <CardHeader className="ptd-psychologist-header">
              <Avatar className="ptd-psychologist-avatar">
                <AvatarFallback>{getInitials(psychologist.name)}</AvatarFallback>
              </Avatar>
              <div className="ptd-psychologist-header-content">
                <span className="ptd-psychologist-name">{psychologist.name}</span>
                <span className="ptd-psychologist-specialty">
                  {psychologist.specialty}
                </span>
              </div>
            </CardHeader>

            <CardContent className="ptd-psychologist-info">
              <div className="ptd-psychologist-meta">
                <Badge variant="secondary" className="ptd-psychologist-badge">
                  <Star className="size-3 text-accent-orange" />
                  {psychologist.rating.toFixed(1)}
                </Badge>
                <span className="ptd-psychologist-price">
                  {Currency.toBRL(psychologist.pricePerSession)} / Sessão
                </span>
              </div>
            </CardContent>

            <CardFooter className="ptd-psychologist-footer">
              <Button
                size="sm"
                onClick={handleAction}
                className="ptd-psychologist-action"
              >
                {psychologist.isLinked ? 'Ver perfil' : 'Vincular'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
