import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Loader2 } from 'lucide-react'

import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { validatePatientInvite } from '@/api/patient-profiles/validate-patient-invite'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

type Iparams = {
  token: string
}

export function ValidatePatientInvitePage() {
  const navigate = useNavigate()
  const { token } = useParams<Iparams>()

  const { data: validatedInvite, isPending: isValidatingToken } = useQuery({
    queryKey: ['validate-patient-invite-token', token],
    queryFn: () => validatePatientInvite(token),
    enabled: Boolean(token),
    retry: 2,
  })

  const formattedExpiresAt =
    validatedInvite &&
    format(validatedInvite.expiresAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR,
    })

  const handleRedirectToNextStep = () => {
    const userHasAccount = Boolean(validatedInvite?.userHasAccount)
    return userHasAccount
      ? navigate(`/patient/invite/${token}/review`)
      : navigate(`/patient/invite/${token}/register`)
  }

  return (
    <main className="flex items-center justify-center">
      {isValidatingToken ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <p>Aguarde, estamos encontrando e validando o seu convite...</p>
        </div>
      ) : (
        <Card className="w-lg gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
              {validatedInvite?.patientFirstName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Profissional:</span>{' '}
              {validatedInvite?.psychologistDisplayName}
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button className="self-end" onClick={handleRedirectToNextStep}>
              Continuar
            </Button>
            <div className="w-full border-t pt-3">
              <p className="text-xs text-center text-muted-foreground">
                Convite expira em {formattedExpiresAt}
              </p>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  )
}
