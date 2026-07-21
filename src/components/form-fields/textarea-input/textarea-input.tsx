import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import { Textarea } from '@/components/ui/textarea'
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

type ITextareaInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    rows?: number
    className?: string
  }

export function TextareaInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  disabled,
  rows = 4,
  className,
}: ITextareaInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn('ff-textarea', className)}
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
