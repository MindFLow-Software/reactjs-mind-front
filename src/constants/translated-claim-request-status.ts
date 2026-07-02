import { ClaimRequestStatus } from '@/types/patient-profile-claim-request'

export const translatedClaimRequestStatus = {
  [ClaimRequestStatus.APPROVED]: 'Aprovado',
  [ClaimRequestStatus.PENDING]: 'Pendente',
  [ClaimRequestStatus.REJECTED]: 'Rejeitado',
}
