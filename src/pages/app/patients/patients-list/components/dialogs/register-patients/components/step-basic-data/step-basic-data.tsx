import { useFormContext, useWatch } from 'react-hook-form'
import { Shield, UserRound } from 'lucide-react'

import { TextInput } from '@/components/form-fields/text-input/text-input'
import { CpfInput } from '@/components/form-fields/cpf-input/cpf-input'
import { DateInput } from '@/components/form-fields/date-input/date-input'
import { GenderSelectInput } from '@/components/form-fields/gender-select-input/gender-select-input'

import { Time } from '@/utils/time'
import type { CreatePatientFormData } from '@/validators/patients/form/create-patient-schema'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

import { AvatarUploadField } from '@/components/form-fields/avatar-upload-field/avatar-upload-field'
import { SectionTitle } from '../section-title/section-title'

import '../../../patient-form-fields.css'

type IStepBasicData = {
  onAvatarSelect: (file: File | null) => void
  patient: IPatientProfile | null
}

export function StepBasicData({ onAvatarSelect, patient }: IStepBasicData) {
  const { control } = useFormContext<CreatePatientFormData>()
  const dateOfBirth = useWatch({ control, name: 'dateOfBirth' })
  const age = Time.calculateAge(dateOfBirth)

  const fullName = patient ? `${patient.firstName} ${patient.lastName}` : null

  return (
    <div className="flex flex-col gap-5">
      <AvatarUploadField
        avatar={{
          name: fullName,
          onFileSelect: onAvatarSelect,
          defaultUrl: patient?.profileImageUrl,
        }}
        label="Foto do paciente"
        description="JPG ou PNG · até 2 MB · opcional"
      />

      <div>
        <SectionTitle icon={UserRound} label="Identificação" />
        <div className="patient-form-grid-2">
          <TextInput<CreatePatientFormData>
            name="firstName"
            label="Nome"
            placeholder="Ex: Ana Luísa"
            autoComplete="off"
          />
          <TextInput<CreatePatientFormData>
            name="lastName"
            label="Sobrenome"
            placeholder="Ex: Costa"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <SectionTitle icon={Shield} label="Dados pessoais" />
        <div className="patient-form-grid-2">
          <CpfInput<CreatePatientFormData> name="cpf" label="CPF" />
          <DateInput<CreatePatientFormData>
            name="dateOfBirth"
            label="Nascimento"
            description={age ?? undefined}
            disableFuture
          />
        </div>

        <div className="mt-3">
          <GenderSelectInput<CreatePatientFormData>
            name="gender"
            label="Gênero"
          />
        </div>
      </div>
    </div>
  )
}
