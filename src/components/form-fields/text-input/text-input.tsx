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

import type { IFormFieldBaseProps } from '../types'

import '../form-fields.css'

type ITextInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    type?: 'text' | 'tel' | 'url'
    autoComplete?: string
    className?: string
  }

export function TextInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  disabled,
  type = 'text',
  autoComplete,
  className,
}: ITextInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              className={cn('ff-input', className)}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
