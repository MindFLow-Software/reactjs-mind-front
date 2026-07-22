import type { ChangeEvent } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Normalizer } from '@/utils/normalizer'

import type { IFormFieldBaseProps } from '../types'

import '../form-fields.css'

type ICpfInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    className?: string
  }

export function CpfInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = '000.000.000-00',
  disabled,
  className,
}: ICpfInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        function handleChange(event: ChangeEvent<HTMLInputElement>) {
          field.onChange(Normalizer.unmask(event.target.value))
        }

        return (
          <FormItem className="gap-1">
            {label && <FormLabel className="ff-input-label">{label}</FormLabel>}
            <FormControl>
              <Input
                value={Normalizer.maskCpf(field.value ?? '')}
                onChange={handleChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                placeholder={placeholder}
                inputMode="numeric"
                maxLength={14}
                disabled={disabled}
                autoComplete="off"
                className={cn('ff-input tabular-nums', className)}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
