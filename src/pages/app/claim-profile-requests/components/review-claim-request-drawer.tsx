import { useMutation, useQuery } from '@tanstack/react-query'
import { ShieldCheck, UserCheck } from 'lucide-react'

import { getPatientProfileClaimRequestById } from '@/api/patient-profiles/get-patient-profile-claim-request-by-id'

import {
  DrawerTitle,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerDescription,
} from '@/components/ui/drawer'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { submitPatientProfileClaimRequest } from '@/api/patient-profiles/submit-patient-profile-claim-request'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { ClaimRequestStatus } from '@/types/enums'
import { ClaimRequestStatusBadge } from './claim-request-status-badge'

type IreviewClaimRequestDrawer = {
  isOpen: boolean
  claimRequestId: string | null
}

export function ReviewClaimRequestDrawer({
  isOpen,
  claimRequestId,
}: IreviewClaimRequestDrawer) {
  const { data } = useQuery({
    queryKey: ['review-patient-profile-claim-requests', claimRequestId],
    queryFn: async () => getPatientProfileClaimRequestById(claimRequestId),
    enabled: isOpen,
  })

  const { mutateAsync } = useMutation({
    mutationKey: ['submit-patient-profile-claim-request', claimRequestId],
    mutationFn: submitPatientProfileClaimRequest,
    onSuccess: () => {},
    onError: (error) => {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.error?.message
        : error?.message

      toast.error(errorMessage)
    },
  })

  const handleSubmitPatientProfileClaimRequest = async (
    action: 'approve' | 'reject',
  ) => {
    mutateAsync({ action, claimRequestId })
  }

  const request = data?.request
  const status = request?.status ?? null
  const isDisabled = request?.status !== ClaimRequestStatus.PENDING

  return (
    <DrawerContent className="lg:min-w-2xl">
      <DrawerHeader className="flex flex-row items-start justify-between">
        <div>
          <DrawerTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center p-1.5 bg-blue-200 rounded-md w-fit">
              <UserCheck size={18} className="text-blue-500" />
            </div>
            Revisar solicitação
          </DrawerTitle>
          <DrawerDescription>
            Compare os dados antes de aprovar o vínculo.
          </DrawerDescription>
        </div>
        <ClaimRequestStatusBadge status={status} />
      </DrawerHeader>

      <div className="space-y-4 px-4">
        <div className="flex items-center gap-2 w-fit border border-blue-500 bg-blue-100 rounded-md p-2">
          <ShieldCheck className="text-blue-800 shrink-0" size={20} />
          <div>
            <h3 className="text-blue-800">Confira os dados com cuidado</h3>
            <p className="text-xs text-blue-800">
              Aprove apenas solicitações que você reconhece. Em caso de dúvida,
              recuse ou confirme os dados diretamente com o paciente.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Card className="min-h-68 max-w-1/2 w-full p-4 gap-2">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className="bg-blue-500 size-2 rounded-full" />
                <span>Dados do solicitante</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-0">
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">Nome</span>
                <span className="text-sm">{request?.requesterFirstName}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">CPF</span>
                <span className="text-sm">{request?.requestedCpf}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">
                  Nascimento
                </span>
                <span className="text-sm">
                  {request?.requesterDateOfBirth
                    ? request?.requesterDateOfBirth
                    : '--/--/----'}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">Email</span>
                <span className="text-sm">{request?.requesterEmail}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-68 max-w-1/2 w-full p-4 gap-2">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className="bg-green-500 size-2 rounded-full" />
                <span>Perfil cadastrado</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-0">
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">Nome</span>
                <span className="text-sm">
                  {request?.patientProfileFirstName}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">CPF</span>
                <span className="text-sm">{request?.patientProfileCpf}</span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">
                  Nascimento
                </span>
                <span className="text-sm">
                  {request?.patientProfileDateOfBirth
                    ? request?.patientProfileDateOfBirth
                    : '--/--/----'}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col">
                <span className="capitalize tracking-wider text-sm">Email</span>
                <span className="text-sm">{request?.patientProfileEmail}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DrawerFooter className="flex flex-row items-center justify-end gap-2">
        <DrawerClose>
          <Button variant="outline">Fechar</Button>
        </DrawerClose>
        <Button
          variant="outline"
          disabled={isDisabled}
          className="text-red-500 hover:text-red-500"
          onClick={() => handleSubmitPatientProfileClaimRequest('reject')}
        >
          Recusar solicitação
        </Button>
        <Button
          variant="outline"
          disabled={isDisabled}
          onClick={() => handleSubmitPatientProfileClaimRequest('approve')}
          className="bg-green-700 hover:bg-green-800 text-white hover:text-white"
        >
          Aprovar solicitação
        </Button>
      </DrawerFooter>
    </DrawerContent>
  )
}
