import { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mars, Venus, Users } from 'lucide-react'
import { IMaskMixin } from 'react-imask'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { EXPERTISE_TRANSLATIONS } from '@/utils/mappers'
import { cn } from '@/lib/utils'
import type { Expertise } from '@/types/expertise'
import { z } from 'zod'
import { Gender } from '@/types/patient'

const completeRegistrationSchema = z.object({
  crp: z.string().min(4, 'CRP é obrigatório'),
  expertise: z.enum(
    [
      'CLINICAL',
      'SOCIAL',
      'INFANT',
      'JURIDICAL',
      'EDUCATIONAL',
      'ORGANIZATIONAL',
      'PSYCHOTHERAPIST',
      'NEUROPSYCHOLOGY',
      'OTHER',
    ],
    { error: 'Selecione uma especialidade' },
  ),
  gender: z.enum(['MASCULINE', 'FEMININE', 'OTHER'], {
    error: 'Selecione um gênero',
  }),
})

export type CompleteRegistrationSchema = z.infer<
  typeof completeRegistrationSchema
>

interface MaskedInputBaseProps extends React.ComponentProps<'input'> {
  inputRef: React.Ref<HTMLInputElement>
}

const MaskedInput = IMaskMixin(
  ({ inputRef, ...props }: MaskedInputBaseProps) => (
    <Input ref={inputRef} {...props} />
  ),
)

const GENDER_OPTIONS: {
  value: Gender
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: Gender.FEMININE,
    label: 'Feminino',
    icon: <Venus className="h-4 w-4 text-rose-500" />,
  },
  {
    value: Gender.MASCULINE,
    label: 'Masculino',
    icon: <Mars className="h-4 w-4 text-blue-500" />,
  },
  {
    value: Gender.OTHER,
    label: 'Prefiro não informar',
    icon: <Users className="h-4 w-4 text-violet-500" />,
  },
]

interface CompleteRegistrationFormProps {
  onSubmit: (data: CompleteRegistrationSchema) => Promise<void>
  isPending: boolean
  submitLabel?: string
}

export function CompleteRegistrationForm({
  onSubmit,
  isPending,
  submitLabel = 'Concluir cadastro',
}: CompleteRegistrationFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteRegistrationSchema>({
    resolver: zodResolver(completeRegistrationSchema),
  })

  const handleFormSubmit = useCallback(
    (data: CompleteRegistrationSchema) => onSubmit(data),
    [onSubmit],
  )

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup className="flex flex-col gap-4">
        <Field>
          <FieldLabel
            htmlFor="crp"
            className={cn(errors.crp && 'text-red-500')}
          >
            CRP
          </FieldLabel>
          <Controller
            name="crp"
            control={control}
            render={({ field: { ref, ...fieldProps } }) => (
              <MaskedInput
                {...fieldProps}
                inputRef={ref}
                id="crp"
                mask="00/000000"
                placeholder="Ex: 06/123456"
                autoComplete="off"
                className={cn(
                  'h-11 tabular-nums',
                  errors.crp && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
            )}
          />
          <FieldError errors={[errors.crp]} />
        </Field>

        <Field>
          <FieldLabel className={cn(errors.expertise && 'text-red-500')}>
            Especialidade
          </FieldLabel>
          <Controller
            name="expertise"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    'w-full cursor-pointer h-11',
                    errors.expertise &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                >
                  <SelectValue placeholder="Selecione sua especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(EXPERTISE_TRANSLATIONS) as Expertise[]).map(
                    (key) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="cursor-pointer"
                      >
                        {EXPERTISE_TRANSLATIONS[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.expertise]} />
        </Field>

        <Field>
          <FieldLabel className={cn(errors.gender && 'text-red-500')}>
            Gênero
          </FieldLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    'w-full cursor-pointer h-11',
                    errors.gender &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                >
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map(({ value, label, icon }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {icon}
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.gender]} />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium text-white cursor-pointer"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Salvando...
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}
