import '../../../patient-form-fields.css'
import './step-basic-data.css'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import { Check, Shield, UserRound } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/maked-input/maked-input'

import { Time } from '@/utils/time'
import { Normalizer } from '@/utils/normalizer'
import { GENDER_OPTIONS } from '../../constants'
import type { CreatePatientFormData } from '@/validators/patients/form/create-patient-schema'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

import { SectionTitle } from '../section-title/section-title'
import { PillRadio } from '../pill-radio/pill-radio'
import { AvatarUploadField } from '@/components/avatar-upload-field/avatar-upload-field'

type IStepBasicData = {
  patient: IPatientProfile | null
}

const CPF_LENGTH = 11

export function StepBasicData({ patient }: IStepBasicData) {
  const { watch, control, setValue } = useFormContext<CreatePatientFormData>()

  const [birthInput, setBirthInput] = useState<string>('')

  const handleAvatarSelect = useCallback(
    (file: File | null) => {
      setValue('profileImage', file ?? undefined, { shouldDirty: true })
    },
    [setValue],
  )

  const cpfDigits = Normalizer.digits(watch('cpf'))
  const isCpfComplete = cpfDigits.length === CPF_LENGTH

  const dateOfBirth = watch('dateOfBirth')
  const age = Time.calculateAge(dateOfBirth)

  const fullName = patient ? `${patient.firstName} ${patient.lastName}` : null

  function handleBirthChange(
    event: ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: Date | null) => void,
  ) {
    const masked = Time.maskDateInput(event.target.value)
    setBirthInput(masked)

    const { date } = Time.textToDate(masked)
    fieldOnChange(date && !Time.isFuture(date) ? date : null)
  }

  useEffect(() => {
    if (!dateOfBirth) return

    setBirthInput(Time.toBrazilianFormat(dateOfBirth))
  }, [dateOfBirth])

  return (
    <div className="flex flex-col gap-5">
      <AvatarUploadField
        identity={{ name: fullName, defaultUrl: patient?.profileImageUrl }}
        copy={{
          label: 'Foto do paciente',
          description: 'JPG ou PNG · até 2 MB · opcional',
        }}
        onFileSelect={handleAvatarSelect}
      />

      <div>
        <SectionTitle icon={UserRound} label="Identificação" />
        <div className="patient-form-grid-2">
          <FormField
            control={control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Nome <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="firstName"
                    placeholder="Ex: Ana Luísa"
                    autoComplete="off"
                    className={cn(
                      'patient-input',
                      fieldState.invalid && 'patient-input--invalid',
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Sobrenome <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="lastName"
                    autoComplete="off"
                    placeholder="Ex: Costa"
                    className={cn(
                      'patient-input',
                      fieldState.invalid && 'patient-input--invalid',
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <SectionTitle icon={Shield} label="Dados pessoais" />
        <div className="patient-form-grid-2">
          <FormField
            name="cpf"
            control={control}
            render={({ field, fieldState }) => {
              const isCpfValid =
                cpfDigits.length >= CPF_LENGTH && !fieldState.invalid

              return (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    CPF{' '}
                    <span className="patient-field-hint">
                      verificação automática
                    </span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <MaskedInput
                        id="cpf"
                        {...field}
                        inputRef={field.ref}
                        mask="000.000.000-00"
                        placeholder="000.000.000-00"
                        onAccept={(value: string) => field.onChange(value)}
                        className={cn(
                          'patient-input',
                          'tabular-nums',
                          isCpfValid && 'border-emerald-500 pr-9',
                          !isCpfValid &&
                            fieldState.invalid &&
                            'patient-input--invalid',
                        )}
                      />
                    </FormControl>
                    {isCpfComplete && !fieldState.invalid && (
                      <Check className="rp-cpf-check" />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nascimento</FormLabel>
                <FormControl>
                  <Input
                    maxLength={10}
                    value={birthInput}
                    onChange={(e) => handleBirthChange(e, field.onChange)}
                    placeholder="DD/MM/AAAA"
                    inputMode="numeric"
                    className={cn('patient-input', 'tabular-nums')}
                  />
                </FormControl>
                {age && <p className="patient-value-hint">{age}</p>}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-3">
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <FormControl>
                  <PillRadio
                    name="gender"
                    options={GENDER_OPTIONS}
                    selection={{ value: field.value, onChange: field.onChange }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
