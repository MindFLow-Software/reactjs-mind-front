import './professional-identity-form-step.css'
import { Controller, useFormContext } from 'react-hook-form'

import z from 'zod'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Field, FieldLabel } from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MaskedInput } from '@/components/maked-input/maked-input'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { SelectInput } from '@/components/form-fields/select-input/select-input'
import { TextareaInput } from '@/components/form-fields/textarea-input/textarea-input'

import { Expertise, Honorific, Languages } from '@/types/shared/enums'
import { translatedExpertise } from '@/constants/translated-expertise'
import { createPsychologistProfileSchema } from '@/validators/psychologists/form/create-psychologist-profile-schema'
import { translatedLanguages } from '@/constants/translated-languages'

type ICreatePsychologistProfile = z.infer<
  typeof createPsychologistProfileSchema
>

const HONORIFIC_OPTIONS = [
  { value: Honorific.MASC_DR, label: 'Dr.' },
  { value: Honorific.FEMININE_DR, label: 'Dra.' },
  { value: Honorific.MSC, label: 'MSc.' },
  { value: Honorific.PHD, label: 'PhD' },
]

const EXPERTISE_OPTIONS = (
  Object.entries(translatedExpertise) as [Expertise, string][]
).map(([value, label]) => ({ value, label }))

export function ProfessionalIdentityFormStep() {
  const { control } = useFormContext<ICreatePsychologistProfile>()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-start gap-2">
        <div className="flex-1">
          <TextInput<ICreatePsychologistProfile>
            name="professionalName"
            label="Nome Profissional"
            placeholder="Seu nome profissional"
          />
        </div>
        <div className="w-48">
          <SelectInput<ICreatePsychologistProfile, Honorific>
            name="honorific"
            label="Honorífico(a)"
            placeholder="Honorífico(a)"
            options={HONORIFIC_OPTIONS}
          />
        </div>
        <Controller
          name="crp"
          control={control}
          render={({ field }) => (
            <Field className="max-w-32 gap-1">
              <FieldLabel htmlFor="crp">CRP</FieldLabel>
              <MaskedInput
                {...field}
                id="crp"
                placeholder="00/000000"
                mask="00/000000"
              />
            </Field>
          )}
        />
      </div>

      <FormField
        control={control}
        name="languages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Línguas</FormLabel>
            <FormControl>
              <ToggleGroup
                type="multiple"
                variant="outline"
                value={field.value ?? []}
                onValueChange={(value) => field.onChange(value as Languages[])}
                className="justify-start"
              >
                {Object.values(Languages).map((language) => (
                  <ToggleGroupItem key={language} value={language}>
                    {translatedLanguages[language]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <SelectInput<ICreatePsychologistProfile, Expertise>
        name="expertise"
        label="Especialidade"
        placeholder="Selecione sua área"
        options={EXPERTISE_OPTIONS}
      />

      <TextareaInput<ICreatePsychologistProfile>
        name="professionalBio"
        label="Biografia profissional"
        placeholder="Digite sua biografia profissional (MÁX. 200 CARACTERES)"
        description="Os pacientes lerão isso no seu perfil."
        rows={6}
      />
    </div>
  )
}
