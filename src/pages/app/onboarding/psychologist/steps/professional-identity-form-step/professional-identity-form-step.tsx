import './professional-identity-form-step.css'
import { Controller, useFormContext } from 'react-hook-form'

import z from 'zod'

import { cn } from '@/lib/utils'

import {
  Field,
  FieldSet,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from '@/components/ui/field'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { MaskedInput } from '@/components/maked-input/maked-input'

import { Expertise, Honorific, Languages } from '@/types/shared/enums'
import { translatedExpertise } from '@/constants/translated-expertise'
import { createPsychologistProfileSchema } from '@/validators/psychologists/form/create-psychologist-profile-schema'
import { translatedLanguages } from '@/constants/translated-languages'

type ICreatePsychologistProfile = z.infer<
  typeof createPsychologistProfileSchema
>

export function ProfessionalIdentityFormStep() {
  const { watch, control, setValue } =
    useFormContext<ICreatePsychologistProfile>()

  const selectedExpertise = watch('expertise')
  const selectedLanguages = watch('languages')

  const handleToggleLanguage = (language: Languages) => {
    const alreadyAdded = selectedLanguages.includes(language)

    if (!alreadyAdded) {
      setValue('languages', [...selectedLanguages, language])
      return
    }

    setValue(
      'languages',
      selectedLanguages.filter((lang) => lang !== language),
    )
  }

  return (
    <div>
      <FieldSet className="flex flex-col gap-4">
        <FieldGroup className="flex flex-row items-start gap-2">
          <Controller
            name="professionalName"
            control={control}
            render={({ field }) => (
              <Field className="gap-1 flex-1">
                <FieldLabel htmlFor="professionalName">
                  Nome Profissional
                </FieldLabel>
                <Input
                  {...field}
                  id="professionalName"
                  placeholder="Seu nome profissional"
                />
              </Field>
            )}
          />
          <Controller
            name="honorific"
            control={control}
            render={({ field }) => (
              <Field className="gap-1 w-48 max-w-48">
                <FieldLabel htmlFor="honorific">Honorífico(a)</FieldLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue id="honorific" placeholder="Honorífico(a)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Selecione seu título</SelectLabel>
                      <SelectItem value={Honorific.MASC_DR}>Dr.</SelectItem>
                      <SelectItem value={Honorific.FEMININE_DR}>
                        Dra.
                      </SelectItem>
                      <SelectItem value={Honorific.MSC}>MSc.</SelectItem>
                      <SelectItem value={Honorific.PHD}>PhD</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
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
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="languages"
            control={control}
            render={() => (
              <Field className="max-w-32 gap-1">
                <FieldLabel>Línguas</FieldLabel>
                <div className="flex gap-2">
                  {Object.values(Languages).map((language) => {
                    return (
                      <Badge
                        key={language}
                        variant="outline"
                        onClick={() => handleToggleLanguage(language)}
                        className={cn(
                          'psob-badge',
                          selectedLanguages.includes(language) &&
                            'psob-badge-selected',
                        )}
                      >
                        {translatedLanguages[language]}
                      </Badge>
                    )
                  })}
                </div>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="expertise"
            control={control}
            render={({ field }) => (
              <Field className="max-w-32 gap-1">
                <FieldLabel>Especialidades</FieldLabel>
                <div className="flex gap-2">
                  {Object.values(Expertise).map((expertise) => {
                    return (
                      <Badge
                        key={expertise}
                        variant="outline"
                        onClick={() => {
                          field.onChange(expertise)
                        }}
                        className={cn(
                          'psob-badge',
                          selectedExpertise === expertise &&
                            'psob-badge-selected',
                        )}
                      >
                        {translatedExpertise[expertise]}
                      </Badge>
                    )
                  })}
                </div>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="professionalBio"
            control={control}
            render={({ field }) => (
              <Field className="gap-1">
                <FieldLabel htmlFor="professionalBio">
                  Biografia profissional
                </FieldLabel>
                <Textarea
                  {...field}
                  maxLength={200}
                  id="professionalBio"
                  className="h-40 min-h-40 max-h-80"
                  placeholder="Digite sua biografia profissional (MÁX. 200 CARACTERES)"
                />
                <FieldDescription className="text-xs">
                  Os pacientes lerão isso no seu perfil.
                </FieldDescription>
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
