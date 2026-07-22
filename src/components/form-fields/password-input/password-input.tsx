import { useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

import type { IFormFieldBaseProps } from '../types'

import './password-input.css'

type IPasswordInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    autoComplete?: string
    className?: string
  }

export function PasswordInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  disabled,
  autoComplete = 'current-password',
  className,
}: IPasswordInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const [visible, setVisible] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          {label && <FormLabel className="pi-input-label">{label}</FormLabel>}
          <FormControl>
            <InputGroup className={cn('pi-root', className)}>
              <InputGroupInput
                type={visible ? 'text' : 'password'}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                {...field}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setVisible((prev) => !prev)}
                >
                  {visible ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
