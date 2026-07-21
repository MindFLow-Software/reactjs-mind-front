import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, User, Briefcase } from 'lucide-react'

import { translatedLanguages } from '@/constants/translated-languages'
import type { IPsychologistProfile } from '@/types/psychologist/psychologist-profile'
import { Expertise, Honorific, Languages } from '@/types/shared/enums'
import { useUpdatePsychologistProfile } from '../../hooks/use-update-psychologist-profile'
import { translatedExpertise } from '@/constants/translated-expertise'
import { usePsychologistProfile } from '@/hooks/use-psychologist-profile'

import {
  updatePsychologistSchema,
  type UpdatePsychologistData,
} from '@/validators/psychologists/form/update-psychologist-schema'

import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Field, FieldLabel } from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { IconBox } from '@/components/icon-box/icon-box'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { SelectInput } from '@/components/form-fields/select-input/select-input'
import { TextareaInput } from '@/components/form-fields/textarea-input/textarea-input'
import { AvatarUploadField } from '@/components/form-fields/avatar-upload-field/avatar-upload-field'
import { MaskedInput } from '@/components/maked-input/maked-input'

import './edit-psychologist-profile-dialog.css'

type IEditPsychologistProfile = {
  onClose: () => void
  psychologistProfileId: string | null
}

const HONORIFIC_OPTIONS = [
  { value: Honorific.MASC_DR, label: 'Dr.' },
  { value: Honorific.FEMININE_DR, label: 'Dra.' },
  { value: Honorific.MSC, label: 'MSc.' },
  { value: Honorific.PHD, label: 'PhD' },
]

const EXPERTISE_OPTIONS = (
  Object.entries(translatedExpertise) as [Expertise, string][]
).map(([value, label]) => ({ value, label }))

function buildDefaultValues(
  psychologistProfile?: IPsychologistProfile,
): UpdatePsychologistData {
  return {
    crp: psychologistProfile?.crp ?? '',
    honorific: psychologistProfile?.honorific,
    languages: psychologistProfile?.languages,
    expertise: psychologistProfile?.expertise,
    profileImageUrl: psychologistProfile?.profileImageUrl ?? null,
    professionalBio: psychologistProfile?.professionalBio ?? '',
    professionalName: psychologistProfile?.professionalName ?? '',
  }
}

export function EditPsychologistProfile({
  onClose,
  psychologistProfileId,
}: IEditPsychologistProfile) {
  const { data } = usePsychologistProfile(psychologistProfileId)
  const { updateProfileFn, isUpdatingPsychologistProfile } =
    useUpdatePsychologistProfile()

  const psychologistProfile = data?.psychologist

  const form = useForm<UpdatePsychologistData>({
    resolver: zodResolver(updatePsychologistSchema),
    mode: 'onTouched',
  })

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, isValid },
  } = form

  const professionalName = watch('professionalName')

  const handleAvatarSelect = useCallback(
    (file: File | null) => {
      setValue('profileImage', file ?? undefined, { shouldDirty: true })
    },
    [setValue],
  )

  async function onSubmit(data: UpdatePsychologistData) {
    await updateProfileFn(data)
    onClose()
  }

  useEffect(() => {
    if (!psychologistProfile) return

    reset(buildDefaultValues(psychologistProfile))
  }, [psychologistProfile, reset])

  return (
    <DialogContent className="acc-edit-content">
      <DialogHeader className="acc-edit-header">
        <IconBox icon={User} variant="primary" size="md" />
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
            <AvatarUploadField
              avatar={{
                name: professionalName || null,
                defaultUrl: psychologistProfile?.profileImageUrl,
                onFileSelect: handleAvatarSelect,
              }}
              label="Foto de perfil"
              description="JPG ou PNG · até 2 MB · opcional"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput<UpdatePsychologistData>
                name="professionalName"
                label="Nome Profissional"
                placeholder="Seu nome profissional"
              />
              <SelectInput<UpdatePsychologistData, Honorific>
                name="honorific"
                label="Honorífico(a)"
                placeholder="Honorífico(a)"
                options={HONORIFIC_OPTIONS}
              />
            </div>
          </div>

          <div className="acc-edit-section">
            <div className="acc-edit-section-heading">
              <Briefcase className="size-4" />
              <h3 className="acc-edit-section-title">Atuação Profissional</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectInput<UpdatePsychologistData, Expertise>
                name="expertise"
                label="Especialidade Principal"
                placeholder="Selecione sua área"
                options={EXPERTISE_OPTIONS}
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

          <div className="grid grid-cols-1 gap-4">
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
                      onValueChange={(value) =>
                        field.onChange(value as Languages[])
                      }
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
          </div>

          <TextareaInput<UpdatePsychologistData>
            name="professionalBio"
            label="Biografia profissional"
            placeholder="Digite sua biografia profissional (MÁX. 200 CARACTERES)"
            description="Os pacientes lerão isso no seu perfil."
            rows={6}
          />

          <div className="acc-edit-footer">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isUpdatingPsychologistProfile}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="acc-edit-submit-btn"
              disabled={isUpdatingPsychologistProfile || !isDirty || !isValid}
            >
              {isUpdatingPsychologistProfile ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
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
