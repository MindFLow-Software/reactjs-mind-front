import { useNavigate } from 'react-router-dom'
import { ArrowRight, Key, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { TitleIcon } from '@/components/title-icon/title-icon'
import { ProfileSectionHeader } from '../profile-section-header/profile-section-header'

import './patient-profile-possible-candidates-section.css'

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

      <Card className="pf-candidates-card">
        <CardHeader className="pf-candidates-header">
          <TitleIcon className="pf-candidates-icon">
            <Key />
          </TitleIcon>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm text-foreground">
              Encontramos perfis que podem ser seus
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Há perfis de paciente cadastrados com o seu CPF que podem estar
              relacionados à sua conta. Você pode visualizá-los e solicitar
              vínculo, caso pertençam a você.
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="pf-candidates-footer">
          <Button
            size="sm"
            onClick={handleNavigateToClaimCandidatesPage}
            className="pf-candidates-btn"
          >
            Visualizar possíveis vínculos
            <ArrowRight size={16} />
          </Button>
          <p className="pf-candidate-footer-details">
            <ShieldCheck size={16} className="text-success" />
            Identificação por CPF, sem ações automáticas.
          </p>
        </CardFooter>
      </Card>
    </section>
  )
}
