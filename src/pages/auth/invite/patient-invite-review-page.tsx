import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ClipboardCheck, Loader2 } from 'lucide-react'

import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { validatePatientInvite } from '@/api/patient-profiles/validate-patient-invite'
import { submitPatientInviteResponse } from '@/api/patient-profiles/submit-patient-invite-response'

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

export function PatientInviteReviewPage() {
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
    format(
      new Date(validatedInvite.expiresAt),
      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
      {
        locale: ptBR,
      },
    )

  const { mutateAsync } = useMutation({
    mutationKey: ['submit-patient-invite-response', token],
    mutationFn: submitPatientInviteResponse,
    onSuccess: (_, { action }) => {
      const message =
        action === 'accept' ? 'Convite aceito.' : 'Convite negado.'

      toast.success(message)
      navigate('/profiles')
    },
  })

  const handleSubmitInviteReponse = async (action: 'accept' | 'reject') => {
    await mutateAsync({ token, action })
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
              <ClipboardCheck size={20} className="text-blue-500" />
              <p>Revise os dados do convite</p>
            </CardTitle>
            <CardDescription>
              Existe um convite válido e vamos mostrar o que será conectado
              antes do usuário confirmar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-sm">
              <span className="font-medium">Paciente:</span>{' '}
              {validatedInvite?.patientFirstName}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm">
                <span className="font-medium">Profissional:</span>{' '}
                {validatedInvite?.psychologistDisplayName}
              </p>
              <p className="text-sm">
                <span className="font-medium">CRP:</span>{' '}
                {validatedInvite?.psychologistCrp}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Convite expira em {formattedExpiresAt}
            </p>
          </CardContent>
          <CardFooter className="justify-end gap-4">
            <Button
              variant="destructive"
              className="text-white"
              onClick={() => handleSubmitInviteReponse('reject')}
            >
              Recusar
            </Button>
            <Button onClick={() => handleSubmitInviteReponse('accept')}>
              Aceitar
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  )
}
