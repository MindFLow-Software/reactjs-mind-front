import { ArrowRight, BadgeCheck, CalendarClock, User } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { TitleIcon } from '@/components/title-icon'
import { ActiveBadge } from '@/components/active-badge'

import { Time } from '@/utils/time'
import { PatientProfileStatus } from '@/types/enums'
import type { IPatientProfile } from '@/types/patient-profile'

import './patient-profile-card.css'

interface IPatientProfileCard {
  profile: IPatientProfile
  onSelect: (profileId: string) => void
}

export function PatientProfileCard({ profile, onSelect }: IPatientProfileCard) {
  const isLinked = Boolean(profile.psychologistPracticeContextId)
  const subtitle = isLinked ? 'Vinculado a um psicólogo' : 'Perfil independente'

  const fullName = `${profile.firstName} ${profile.lastName}`

  return (
    <Card className="pf-entity-card">
      <CardHeader className="pf-entity-card-header">
        <div className="pf-entity-card-title-wrap">
          <TitleIcon variant="secondary">
            <User />
          </TitleIcon>
          <div>
            <CardTitle className="text-sm text-foreground">
              {fullName}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
              {subtitle}
              {isLinked && <BadgeCheck size={16} className="text-green-500" />}
            </CardDescription>
          </div>
        </div>

        <ActiveBadge
          isActive={profile.status === PatientProfileStatus.ACTIVE}
        />
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2">
          <CalendarClock size={16} className="text-teal-600" />
          <span className="text-xs text-muted-foreground">
            Paciente desde {Time.toBrazilianFormat(new Date(profile.createdAt))}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pf-entity-card-footer">
        <Button
          onClick={() => onSelect(profile.id)}
          className="pf-cta-btn pf-cta-btn--secondary"
        >
          Acessar Perfil
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  )
}
