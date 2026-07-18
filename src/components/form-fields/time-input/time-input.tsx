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
import { Time } from '@/utils/time'

import type { IFormFieldBaseProps } from '../types'

import '../form-fields.css'

type ITimeInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    className?: string
  }

export function TimeInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'HH:mm',
  disabled,
  className,
}: ITimeInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        function handleChange(event: ChangeEvent<HTMLInputElement>) {
          field.onChange(Time.maskTimeInput(event.target.value))
        }

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                value={field.value ?? ''}
                onChange={handleChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                placeholder={placeholder}
                inputMode="numeric"
                maxLength={5}
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
