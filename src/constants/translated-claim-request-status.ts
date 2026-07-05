import { ClaimRequestStatus } from '@/types/enums'

export const translatedClaimRequestStatus = {
  [ClaimRequestStatus.APPROVED]: 'Aprovado',
  [ClaimRequestStatus.PENDING]: 'Pendente',
  [ClaimRequestStatus.REJECTED]: 'Rejeitado',
}
