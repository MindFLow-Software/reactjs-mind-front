import { useState, type ChangeEvent } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { parse as dateParse, isValid as dateIsValid, format } from 'date-fns'
import { Check, Shield, UserRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { formatCPF } from '@/utils/formatCPF'
import { formatAGE } from '@/utils/formatAGE'
import { formatDateInput } from '@/utils/formatDateInput'

import { Normalizer } from '@/utils/normalizer'
import type { Ipatient } from '@/types/patient'
import type { PatientFormData } from '@/validators/patients'
import './step-basic-data.css'
import { GENDER_OPTIONS } from '../constants'
import { SectionTitle } from './section-title'
import { PillRadio } from './pill-radio'
import { PatientAvatarUpload } from './patient-avatar-upload'

interface StepBasicDataProps {
  onAvatarSelect: (f: File | null) => void
  patient: Ipatient | null
}

export function StepBasicData({ onAvatarSelect, patient }: StepBasicDataProps) {
  const { control, getValues } = useFormContext<PatientFormData>()

  const [birthInput, setBirthInput] = useState(() => {
    const d = getValues('dateOfBirth')
    return d instanceof Date ? format(d, 'dd/MM/yyyy') : ''
  })

  const cpfValue = useWatch({ control, name: 'cpf' })
  const dateOfBirth = useWatch({ control, name: 'dateOfBirth' })
  const cpfDigits = Normalizer.digits(cpfValue ?? '')
  const age = dateOfBirth ? formatAGE(dateOfBirth) : null

  const initials = patient
    ? `${patient?.firstName[0] ?? ''}${patient?.lastName[0] ?? ''}`.toUpperCase()
    : undefined

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

  return (
    <div className="space-y-5">
      <PatientAvatarUpload
        onFileSelect={onAvatarSelect}
        defaultValue={patient?.profileImageUrl}
        initials={initials}
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
                    placeholder="Ex: Costa"
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
        </div>
      </div>

      {/* Dados pessoais */}
      <div>
        <SectionTitle icon={Shield} label="Dados pessoais" />
        <div className="patient-form-grid-2">
          {/* CPF */}
          <FormField
            control={control}
            name="cpf"
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
                    <Input
                      id="cpf"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(formatCPF(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      autoComplete="off"
                      className={cn(
                        'patient-input',
                        'tabular-nums',
                        cpfDigits.length === 11 &&
                          !fieldState.invalid &&
                          'border-emerald-500 pr-9',
                        fieldState.invalid &&
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
                    value={birthInput}
                    onChange={(e) => handleBirthChange(e, field.onChange)}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="off"
                    className={cn('patient-input', 'tabular-nums')}
                  />
                </FormControl>
                {age !== null && (
                  <p className="patient-value-hint">{age} anos</p>
                )}
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
