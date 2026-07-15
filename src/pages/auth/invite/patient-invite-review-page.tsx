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

import { InviteLoadingState } from './components/invite-loading-state/invite-loading-state'
import { useValidatePatientInvite } from './hooks/use-validate-patient-invite'
import { useSubmitPatientInviteResponse } from './hooks/use-submit-patient-invite-response'
import { formatInviteExpiresAt } from './helpers'
import type { PatientInviteResponseAction } from '@/api/patient-profiles/submit-patient-invite-response'

import './invite-shared.css'
import './patient-invite-review-page.css'

type Iparams = {
  token: string
}

export function PatientInviteReviewPage() {
  const { token } = useParams<Iparams>()

  const { data: invite, isPending } = useValidatePatientInvite(token)
  const { mutate: submitInviteResponse, isPending: isSubmitting } =
    useSubmitPatientInviteResponse()

  const handleSubmitInviteResponse = (action: PatientInviteResponseAction) => {
    submitInviteResponse({ token, action })
  }

  if (isPending) {
    return <InviteLoadingState />
  }

  return (
    <main className="inv-shell">
      <Card className="inv-card">
        <CardHeader>
          <CardTitle className="inv-card-title">
            <ClipboardCheck size={20} className="text-blue-500" />
            <p>Revise os dados do convite</p>
          </CardTitle>
          <CardDescription>
            Existe um convite válido e vamos mostrar o que será conectado antes
            do usuário confirmar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm">
            <span className="font-medium">Paciente:</span>{' '}
            {invite?.patientFirstName}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm">
              <span className="font-medium">Profissional:</span>{' '}
              {invite?.psychologistDisplayName}
            </p>
            <p className="text-sm">
              <span className="font-medium">CRP:</span>{' '}
              {invite?.psychologistCrp}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Convite expira em{' '}
            {invite && formatInviteExpiresAt(invite.expiresAt)}
          </p>
        </CardContent>
        <CardFooter className="inv-review-footer">
          <Button
            variant="destructive"
            disabled={isSubmitting}
            className="text-white"
            onClick={() => handleSubmitInviteResponse('reject')}
          >
            Recusar
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => handleSubmitInviteResponse('accept')}
          >
            Aceitar
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
