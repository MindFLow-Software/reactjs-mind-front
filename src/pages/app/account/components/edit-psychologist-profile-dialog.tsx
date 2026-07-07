'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, User, Briefcase } from 'lucide-react'

import { cn } from '@/lib/utils'

import { translatedLanguages } from '@/types/psychologist'
import { Honorific, Languages } from '@/types/enums'
import { useUpdatePsychologist } from '../hooks/use-update-psychologist'
import { EXPERTISE_TRANSLATIONS } from '@/utils/mappers'

import {
  updatePsychologistSchema,
  type UpdatePsychologistData,
} from '@/validators/psychologists/form/update-psychologist-schema'
import type { UpdatePsychologistBody } from '@/api/psychologists/update-psychologist'

import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'


import {
  Select,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field'

import { Form } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MaskedInput } from '@/components/maked-input'

import './edit-psychologist-profile-dialog.css'

interface IEditPsychologistProfile {
  psychologistProfile: UpdatePsychologistBody
  onClose: () => void
}

function buildDefaultValues(
  psychologistProfile: IEditPsychologistProfile['psychologistProfile'],
): UpdatePsychologistData {
  return {
    crp: psychologistProfile.crp ?? '',
    honorific: psychologistProfile.honorific,
    languages: psychologistProfile.languages,
    expertise: psychologistProfile.expertise,
    profileImageUrl: psychologistProfile.profileImageUrl ?? '',
    professionalBio: psychologistProfile.professionalBio ?? '',
    professionalName: psychologistProfile.professionalName ?? '',
  }
}

export function EditPsychologistProfile({
  onClose,
  psychologistProfile,
}: IEditPsychologistProfile) {
  const form = useForm<UpdatePsychologistData>({
    resolver: zodResolver(updatePsychologistSchema),
    mode: 'onTouched',
    defaultValues: buildDefaultValues(psychologistProfile),
  })

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, isValid },
  } = form

  const selectedLanguages = watch('languages') ?? []

  const handleToggleLanguage = (language: Languages) => {
    const alreadyAdded = selectedLanguages?.includes(language)

    if (!alreadyAdded) {
      setValue('languages', [...selectedLanguages, language])
      return
    }

    setValue(
      'languages',
      selectedLanguages.filter((lang) => lang !== language),
    )
  }

  const { mutateAsync: updateProfileFn, isPending } = useUpdatePsychologist()

  async function onSubmit(data: UpdatePsychologistData) {
    await updateProfileFn(data)
    onClose()
  }

  return (
    <DialogContent className="acc-edit-content">
      <DialogHeader className="acc-edit-header">
        <div className="acc-edit-icon-box">
          <User className="size-5 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <DialogTitle className="acc-edit-title">
            Editar Meu Perfil
          </DialogTitle>
          <DialogDescription className="acc-edit-subtitle">
            Altere suas informações profissionais e de contato.
          </DialogDescription>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-4">
            <div className="acc-edit-section-heading">
              <User className="size-4" />
              <h3 className="acc-edit-section-title">Informações Básicas</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="acc-edit-input"
                      placeholder="Seu nome profissional"
                    />
                  </Field>
                )}
              />
              <Controller
                name="honorific"
                control={control}
                render={({ field }) => (
                  <Field className="gap-1 w-full">
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
            </div>
          </div>

          <div className="acc-edit-section">
            <div className="acc-edit-section-heading">
              <Briefcase className="size-4" />
              <h3 className="acc-edit-section-title">Atuação Profissional</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="expertise"
                render={({ field }) => (
                  <Field className="gap-1">
                    <FieldLabel>Especialidade Principal</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="acc-edit-input">
                        <SelectValue placeholder="Selecione sua área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(EXPERTISE_TRANSLATIONS).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError />
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
                      mask="00/000000"
                      placeholder="00/000000"
                      className="acc-edit-input"
                    />
                  </Field>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="languages"
              control={control}
              render={() => (
                <Field className="gap-1">
                  <FieldLabel>Línguas</FieldLabel>
                  <div className="flex gap-2">
                    {Object.values(Languages).map((language) => {
                      return (
                        <Badge
                          key={language}
                          variant="outline"
                          onClick={() => handleToggleLanguage(language)}
                          className={cn(
                            'acc-edit-badge',
                            selectedLanguages.includes(language) &&
                            'acc-edit-badge-selected',
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
          </div>

          <div className="grid grid-cols-1 gap-4">
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
          </div>

          <div className="acc-edit-footer">
            <DialogClose>
              <Button
                className="cursor-pointer"
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="acc-edit-submit-btn"
              disabled={isPending || !isDirty || !isValid}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
