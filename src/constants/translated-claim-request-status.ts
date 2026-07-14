import { ClaimRequestStatus } from '@/types/claim/claim-request-status'

export const translatedClaimRequestStatus = {
  [ClaimRequestStatus.APPROVED]: 'Aprovado',
  [ClaimRequestStatus.PENDING]: 'Pendente',
  [ClaimRequestStatus.REJECTED]: 'Rejeitado',
}
