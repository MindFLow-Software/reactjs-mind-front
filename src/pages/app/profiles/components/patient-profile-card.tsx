import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Stethoscope,
  User,
} from 'lucide-react'

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

import type { IpatientProfile } from '@/types/patient-profile'

interface IPatientProfileCard {
  profile: IpatientProfile
  onSelect: (profileId: string) => void
}

export function PatientProfileCard({ profile, onSelect }: IPatientProfileCard) {
  const isLinked = Boolean(profile.psychologistPracticeContextId)
  const subtitle = isLinked ? 'Vinculado a um psicólogo' : 'Perfil independente'

  const fullName = `${profile.firstName} ${profile.lastName}`

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0 max-w-1/2 w-full">
      <CardHeader className="flex items-start gap-3 py-4">
        <TitleIcon variant="secondary">
          <User />
        </TitleIcon>

        <div className="min-w-0 flex-1">
          <CardTitle className="text-sm text-foreground">{fullName}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
            {subtitle}
            {isLinked && <BadgeCheck size={16} className="text-green-500" />}
          </CardDescription>
        </div>

        <ActiveBadge isActive={profile.isActive} />
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center gap-2">
            <Stethoscope size={16} className="text-green-600" />
            <span className="text-xs text-muted-foreground">
              Dra. Ana Souza
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarClock size={16} className="text-green-600" />
            <span className="text-xs text-muted-foreground">
              Próxima sessão: Quarta-feira, 14:00
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter className="py-4">
        <Button
          variant="outline"
          onClick={() => onSelect(profile.id)}
          className="flex items-center gap-2 w-full bg-green-600 text-white hover:bg-green-700 hover:text-white dark:hover:bg-green-950/30"
        >
          Acessar Perfil
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  )
}
