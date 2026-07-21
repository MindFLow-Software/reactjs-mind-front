import { Phone } from 'lucide-react'

import { PhoneInput } from '@/components/form-fields/phone-input/phone-input'
import { EmailInput } from '@/components/form-fields/email-input/email-input'
import type { CreatePatientFormData } from '@/validators/patients/form/create-patient-schema'

import { SectionTitle } from '../section-title/section-title'

import '../../../patient-form-fields.css'

export function StepContactAddress() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionTitle icon={Phone} label="Contato" />
        <div className="patient-form-grid-2">
          <PhoneInput<CreatePatientFormData>
            name="phoneNumber"
            label="Celular"
          />
          <EmailInput<CreatePatientFormData>
            name="email"
            label="E-mail"
            placeholder="paciente@email.com"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}
