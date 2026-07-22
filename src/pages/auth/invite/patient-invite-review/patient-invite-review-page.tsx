import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ClipboardCheck } from 'lucide-react'

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
import { PatientInviteResponseAction } from '@/types/invite/patient-invite-response-action'

import { InviteLoadingState } from '../components/invite-loading-state/invite-loading-state'
import { useValidatePatientInvite } from '../hooks/use-validate-patient-invite'
import { useSubmitPatientInviteResponse } from './hooks/use-submit-patient-invite-response'
import type { IInviteRouteParams } from '../../shared/invite-route-params'

import '../../shared/auth-shared.css'
import './patient-invite-review-page.css'

export function PatientInviteReviewPage() {
  const { token } = useParams<IInviteRouteParams>()

  const { patientInvite, isLoadingInvite } = useValidatePatientInvite(token)
  const { submitInviteResponse, isSubmittingResponse } =
    useSubmitPatientInviteResponse()

  const handleRejectInvite = useCallback(() => {
    submitInviteResponse({ token, action: PatientInviteResponseAction.REJECT })
  }, [submitInviteResponse, token])

  const handleAcceptInvite = useCallback(() => {
    submitInviteResponse({ token, action: PatientInviteResponseAction.ACCEPT })
  }, [submitInviteResponse, token])

  if (isLoadingInvite) {
    return <InviteLoadingState />
  }

  return (
    <main className="auth-card-shell">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-card-title">
            <ClipboardCheck size={20} className="text-blue-500" />
            <p>Revise os dados do convite</p>
          </CardTitle>
          <CardDescription>
            Existe um convite válido e vamos mostrar o que será conectado antes
            do usuário confirmar.
          </CardDescription>
        </CardHeader>
        <CardContent className="pir-details">
          <p className="pir-detail">
            <span className="font-medium">Paciente:</span>{' '}
            {patientInvite?.patientFirstName}
          </p>
          <div className="pir-professional">
            <p className="pir-detail">
              <span className="font-medium">Profissional:</span>{' '}
              {patientInvite?.psychologistDisplayName}
            </p>
            <p className="pir-detail">
              <span className="font-medium">CRP:</span>{' '}
              {patientInvite?.psychologistCrp}
            </p>
          </div>
          <p className="pir-expiry">
            Convite expira em{' '}
            {Time.toDayLongMonthYearAtTime(patientInvite?.expiresAt)}
          </p>
        </CardContent>
        <CardFooter className="pir-footer">
          <Button
            variant="destructive"
            disabled={isSubmittingResponse}
            className="text-white"
            onClick={handleRejectInvite}
          >
            Recusar
          </Button>
          <Button disabled={isSubmittingResponse} onClick={handleAcceptInvite}>
            Aceitar
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
