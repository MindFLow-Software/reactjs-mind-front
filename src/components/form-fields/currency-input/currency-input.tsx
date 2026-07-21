import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

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

type ICurrencyInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    className?: string
  }

export function CurrencyInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'R$ 0,00',
  disabled,
  className,
}: ICurrencyInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        function handleValueChange(values: { floatValue?: number }) {
          const cents =
            values.floatValue != null
              ? Math.round(values.floatValue * 100)
              : null
          field.onChange(cents)
        }

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <NumericFormat
                value={field.value != null ? field.value / 100 : ''}
                onValueChange={handleValueChange}
                onBlur={field.onBlur}
                name={field.name}
                getInputRef={field.ref}
                placeholder={placeholder}
                disabled={disabled}
                inputMode="decimal"
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                className={cn('ff-input', className)}
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
