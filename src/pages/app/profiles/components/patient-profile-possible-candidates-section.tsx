import { useNavigate } from 'react-router-dom'
import { ArrowRight, Key, ShieldCheck } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { TitleIcon } from '@/components/title-icon'
import { ProfileSectionHeader } from './profile-section-header'

export function PatientProfilePossibleCandidatesSection() {
  const navigate = useNavigate()

  const handleNavigateToClaimCandidatesPage = () => {
    navigate('/profiles/claim-candidates')
  }

  return (
    <section className="w-full">
      <ProfileSectionHeader
        section="Vínculos"
        title="Possíveis vínculos de perfil de paciente"
        label="Confira possíveis perfis de paciente vinculados aos seus dados e associe-os à sua conta, se necessário."
      />

      <Card
        className="flex flex-col gap-4 overflow-hidden w-full bg-violet-100/75 border border-violet-200 shadow-none px-0"
      >
        <CardHeader className="flex items-start gap-3">
          <TitleIcon className="text-violet-500 bg-violet-200">
            <Key />
          </TitleIcon>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm text-foreground">
              Encontramos perfis que podem ser seus
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Há perfis de paciente cadastrados com o seu CPF que podem estar relacionados à sua conta.
              Você pode visualizá-los e solicitar vínculo, caso pertençam a você.
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="flex items-baseline gap-4">
          <Button
            size="sm"
            onClick={handleNavigateToClaimCandidatesPage}
            className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600"
          >
            Visualizar possíveis vínculos
            <ArrowRight size={16} />
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck size={14} />
            <p className="text-xs">
              Identificação por CPF, sem ações automáticas.
            </p>
          </div>
        </CardFooter>
      </Card>
    </section>
  )
}
