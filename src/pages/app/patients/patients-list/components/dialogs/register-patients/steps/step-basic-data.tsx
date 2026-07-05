import { useEffect, useState, type ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import { Check, Shield, UserRound } from 'lucide-react'

import { cn } from '@/lib/utils'
import { parse as dateParse, isValid as dateIsValid } from 'date-fns'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Time } from '@/utils/time'
import { Normalizer } from '@/utils/normalizer'
import { GENDER_OPTIONS } from '../constants'
import { formatDateInput } from '@/utils/formatDateInput'
import type { CreatePatientFormData } from '@/validators/patients/form/create-patient-schema'
import type { IPatientProfile } from '@/types/patient-profile'

import './step-basic-data.css'
import { SectionTitle } from './section-title'
import { PillRadio } from './pill-radio'
import { PatientAvatarUpload } from './patient-avatar-upload'
import { MaskedInput } from '@/components/maked-input'

interface StepBasicDataProps {
  onAvatarSelect: (f: File | null) => void
  patient: IPatientProfile | null
}

export function StepBasicData({ onAvatarSelect, patient }: StepBasicDataProps) {
  const { watch, control } = useFormContext<CreatePatientFormData>()

  const [birthInput, setBirthInput] = useState<string>()

  const cpfValue = watch('cpf')
  const cpfDigits = Normalizer.digits(cpfValue)

  const dateOfBirth = watch('dateOfBirth')
  const age = Time.calculateAge(dateOfBirth)

  const fullName = patient ? `${patient.firstName} ${patient.lastName}` : null

  function handleBirthChange(
    e: ChangeEvent<HTMLInputElement>,
    fieldOnChange: (v: Date | null) => void,
  ) {
    const val = formatDateInput(e.target.value)
    setBirthInput(val)

    if (val.length === 10) {
      const d = dateParse(val, 'dd/MM/yyyy', new Date())
      fieldOnChange(dateIsValid(d) && d <= new Date() ? d : null)
    } else {
      fieldOnChange(null)
    }
  }

  useEffect(() => {
    if (!dateOfBirth) return

    setBirthInput(Time.toBrazilianFormat(dateOfBirth))
  }, [dateOfBirth])

  return (
    <div className="flex flex-col gap-5">
      <PatientAvatarUpload
        fullName={fullName}
        onFileSelect={onAvatarSelect}
        defaultUrl={patient?.profileImageUrl}
      />

      {/* Identificação */}
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
                      fieldState.invalid &&
                        'border-red-600 focus-visible:ring-red-600/20',
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
                      fieldState.invalid &&
                        'border-red-600 focus-visible:ring-red-600/20',
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Dados pessoais */}
      <div>
        <SectionTitle icon={Shield} label="Dados pessoais" />
        <div className="patient-form-grid-2">
          {/* CPF */}
          <FormField
            name="cpf"
            control={control}
            render={({ field, fieldState }) => (
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
                        cpfDigits.length >= 11 && !fieldState.invalid
                          ? 'border-emerald-500 pr-9'
                          : fieldState.invalid &&
                              'border-red-600 focus-visible:ring-red-600/20',
                      )}
                    />
                  </FormControl>
                  {cpfDigits.length === 11 && !fieldState.invalid && (
                    <Check className="rp-cpf-check" />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nascimento */}
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
                {age && <p className="patient-value-hint">{age} anos</p>}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Gênero */}
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
                    value={field.value}
                    onChange={field.onChange}
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
