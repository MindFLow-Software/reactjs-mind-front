import { UserCheck } from 'lucide-react'

import {
  DrawerTitle,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerDescription,
} from '@/components/ui/drawer'

import { Button } from '@/components/ui/button'
import { TitleIcon } from '@/components/title-icon/title-icon'
import { SecurityNotice } from '@/components/security-notice/security-notice'
import { ClaimRequestStatus } from '@/types/claim/claim-request-status'
import type { ClaimRequestAction } from '@/api/patient-profiles/submit-patient-profile-claim-request'

import { ClaimComparisonCard } from '../claim-comparison-card/claim-comparison-card'
import { ClaimRequestStatusBadge } from '../claim-request-status-badge/claim-request-status-badge'
import { useClaimRequestDetail } from '../../hooks/use-claim-request-detail'
import { useSubmitClaimRequest } from '../../hooks/use-submit-claim-request'

import './review-claim-request-drawer.css'

interface ReviewClaimRequestDrawerProps {
  isOpen: boolean
  claimRequestId: string | null
  onClose: () => void
}

export function ReviewClaimRequestDrawer({
  isOpen,
  claimRequestId,
  onClose,
}: ReviewClaimRequestDrawerProps) {
  const { data } = useClaimRequestDetail(claimRequestId, isOpen)
  const { mutate: submitClaimRequest, isPending } = useSubmitClaimRequest({
    onReviewed: onClose,
  })

  const request = data?.request
  const status = request?.status ?? null
  const isDisabled = isPending || request?.status !== ClaimRequestStatus.PENDING

  const handleSubmit = (action: ClaimRequestAction) => {
    submitClaimRequest({ action, claimRequestId })
  }

  return (
    <DrawerContent className="lg:min-w-2xl">
      <DrawerHeader className="flex flex-row items-start justify-between">
        <div>
          <DrawerTitle className="flex items-center gap-2">
            <TitleIcon>
              <UserCheck size={18} />
            </TitleIcon>
            Revisar solicitação
          </DrawerTitle>
          <DrawerDescription>
            Compare os dados antes de aprovar o vínculo.
          </DrawerDescription>
        </div>
        <ClaimRequestStatusBadge status={status} />
      </DrawerHeader>

      <div className="flex flex-col gap-4 px-4">
        <SecurityNotice
          variant="info"
          title="Confira os dados com cuidado"
          description="Aprove apenas solicitações que você reconhece. Em caso de dúvida, recuse ou confirme os dados diretamente com o paciente."
        />

        <div className="flex items-center gap-4">
          <ClaimComparisonCard
            accent="requester"
            title="Dados do solicitante"
            fields={[
              { label: 'Nome', value: request?.requesterFirstName },
              { label: 'CPF', value: request?.requestedCpf },
              {
                label: 'Nascimento',
                value: request?.requesterDateOfBirth ?? '--/--/----',
              },
              { label: 'Email', value: request?.requesterEmail },
            ]}
          />
          <ClaimComparisonCard
            accent="profile"
            title="Perfil cadastrado"
            fields={[
              { label: 'Nome', value: request?.patientProfileFirstName },
              { label: 'CPF', value: request?.patientProfileCpf },
              {
                label: 'Nascimento',
                value: request?.patientProfileDateOfBirth ?? '--/--/----',
              },
              { label: 'Email', value: request?.patientProfileEmail },
            ]}
          />
        </div>
      </div>

      <DrawerFooter className="flex flex-row items-center justify-end gap-2">
        <DrawerClose asChild>
          <Button variant="outline">Fechar</Button>
        </DrawerClose>
        <Button
          variant="outline"
          disabled={isDisabled}
          className="cpr-reject-button"
          onClick={() => handleSubmit('reject')}
        >
          Recusar solicitação
        </Button>
        <Button
          variant="outline"
          disabled={isDisabled}
          className="cpr-approve-button"
          onClick={() => handleSubmit('approve')}
        >
          Aprovar solicitação
        </Button>
      </DrawerFooter>
    </DrawerContent>
  )
}
