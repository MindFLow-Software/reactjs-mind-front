import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { Mars, Users, Venus, type LucideIcon } from 'lucide-react'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Gender } from '@/types/shared/enums'
import { cn } from '@/lib/utils'

import type { IFormFieldBaseProps } from '../types'

import './gender-select-input.css'

type IGenderOption = {
  value: Gender
  label: string
  icon: LucideIcon
  toneClass: string
}

const GENDER_OPTIONS: readonly IGenderOption[] = [
  {
    value: Gender.FEMININE,
    label: 'Feminino',
    icon: Venus,
    toneClass: 'gsi-option--feminine',
  },
  {
    value: Gender.MASCULINE,
    label: 'Masculino',
    icon: Mars,
    toneClass: 'gsi-option--masculine',
  },
  {
    value: Gender.OTHER,
    label: 'Outro / Prefiro não dizer',
    icon: Users,
    toneClass: 'gsi-option--other',
  },
]

type IGenderSelectInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    className?: string
  }

export function GenderSelectInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  disabled,
  className,
}: IGenderSelectInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          {label && <FormLabel className="gsi-input-label">{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
              className={cn('gsi-root', className)}
            >
              {GENDER_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = field.value === option.value

                return (
                  <Label
                    key={option.value}
                    className={cn(
                      'gsi-option',
                      option.toneClass,
                      isSelected && 'gsi-option--selected',
                    )}
                  >
                    <RadioGroupItem value={option.value} className="sr-only" />
                    <Icon className="size-4" />
                    <span>{option.label}</span>
                  </Label>
                )
              })}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
