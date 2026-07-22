import { UserCheck } from 'lucide-react'

import { translatedHonorific } from '@/constants/translated-honorific'
import type { IRegistrationLinkInfo } from '@/types/invite/registration-link-info'

import './registration-link-professional.css'

type IRegistrationLinkProfessional = {
  registrationLink: IRegistrationLinkInfo | undefined
}

export function RegistrationLinkProfessional({
  registrationLink,
}: IRegistrationLinkProfessional) {
  const honorific = registrationLink?.psychologistHonorific

  return (
    <div className="rlp-root">
      <div className="rlp-icon">
        <UserCheck size={20} className="shrink-0 text-success" />
      </div>
      <div className="rlp-details">
        <p className="rlp-name">
          {honorific && translatedHonorific[honorific]}{' '}
          {registrationLink?.professionalName}
        </p>
        <div>
          <p className="rlp-meta">CRP {registrationLink?.psychologistCrp}</p>
          <p className="rlp-meta">
            Você está realizando o cadastro por convite desta profissional.
          </p>
        </div>
      </div>
    </div>
  )
}
