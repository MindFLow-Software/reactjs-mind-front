import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import { InviteLoadingState } from './components/invite-loading-state'
import { useValidatePatientInvite } from './hooks/use-validate-patient-invite'
import { formatInviteExpiresAt } from './helpers'

import './invite-shared.css'
import './validate-patient-invite-page.css'

type Iparams = {
  token: string
}

export function ValidatePatientInvitePage() {
  const navigate = useNavigate()
  const { token } = useParams<Iparams>()

  const { data: invite, isPending } = useValidatePatientInvite(token)

  const handleRedirectToNextStep = () => {
    const userHasAccount = Boolean(invite?.userHasAccount)
    navigate(
      userHasAccount
        ? `/patient/invite/${token}/review`
        : `/patient/invite/${token}/register`,
    )
  }

  if (isPending) {
    return <InviteLoadingState />
  }

  return (
    <main className="inv-shell">
      <Card className="inv-card">
        <CardHeader>
          <CardTitle className="inv-card-title">
            <CheckCircle size={20} className="text-green-500" />
            <p>Convite encontrado</p>
          </CardTitle>
          <CardDescription>
            Encontramos um convite enviado por seu psicólogo. Clique em
            continuar para confirmar seus dados e concluir o vínculo com o
            profissional.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm">
            <span className="font-medium">Paciente:</span>{' '}
            {invite?.patientFirstName}
          </p>
          <p className="text-sm">
            <span className="font-medium">Profissional:</span>{' '}
            {invite?.psychologistDisplayName}
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button className="self-end" onClick={handleRedirectToNextStep}>
            Continuar
          </Button>
          <div className="inv-expiry-footer">
            <p className="text-center text-xs text-muted-foreground">
              Convite expira em{' '}
              {invite && formatInviteExpiresAt(invite.expiresAt)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
