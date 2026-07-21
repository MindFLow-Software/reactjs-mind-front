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

type IPhoneInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    className?: string
  }

export function PhoneInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = '(00) 00000-0000',
  disabled,
  className,
}: IPhoneInputProps<TFieldValues>) {
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
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                value={Normalizer.maskPhone(field.value ?? '')}
                onChange={handleChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                placeholder={placeholder}
                inputMode="numeric"
                maxLength={15}
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
