import { useCallback } from 'react'
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
import { Time } from '@/utils/time'

import { InviteLoadingState } from '../components/invite-loading-state/invite-loading-state'
import { useValidatePatientInvite } from '../hooks/use-validate-patient-invite'
import type { IInviteRouteParams } from '../../shared/invite-route-params'

import '../../shared/auth-shared.css'
import './validate-patient-invite-page.css'

export function ValidatePatientInvitePage() {
  const navigate = useNavigate()
  const { token } = useParams<IInviteRouteParams>()

  const { patientInvite, isLoadingInvite } = useValidatePatientInvite(token)

  const userHasAccount = Boolean(patientInvite?.userHasAccount)

  const handleRedirectToNextStep = useCallback(() => {
    const nextStep = userHasAccount ? 'review' : 'register'
    navigate(`/patient/invite/${token}/${nextStep}`)
  }, [navigate, token, userHasAccount])

  if (isLoadingInvite) {
    return <InviteLoadingState />
  }

  return (
    <main className="auth-card-shell">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-card-title">
            <CheckCircle size={20} className="text-success" />
            <p>Convite encontrado</p>
          </CardTitle>
          <CardDescription>
            Encontramos um convite enviado por seu psicólogo. Clique em
            continuar para confirmar seus dados e concluir o vínculo com o
            profissional.
          </CardDescription>
        </CardHeader>
        <CardContent className="vpi-details">
          <p className="vpi-detail">
            <span className="font-medium">Paciente:</span>{' '}
            {patientInvite?.patientFirstName}
          </p>
          <p className="vpi-detail">
            <span className="font-medium">Profissional:</span>{' '}
            {patientInvite?.psychologistDisplayName}
          </p>
        </CardContent>
        <CardFooter className="vpi-footer">
          <Button className="self-end" onClick={handleRedirectToNextStep}>
            Continuar
          </Button>
          <div className="vpi-expiry">
            <p className="vpi-expiry-text">
              Convite expira em{' '}
              {Time.toDayLongMonthYearAtTime(patientInvite?.expiresAt)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
