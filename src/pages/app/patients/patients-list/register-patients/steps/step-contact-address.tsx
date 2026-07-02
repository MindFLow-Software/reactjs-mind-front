import { useFormContext } from 'react-hook-form'
import { Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { formatPhone } from '@/utils/formatPhone'

import './step-contact-address.css'
import type { PatientFormData } from '@/validators/patients'
import { SectionTitle } from './section-title'

export function StepContactAddress() {
  const { control } = useFormContext<PatientFormData>()

  return (
    <div className="space-y-6">
      <div>
        <SectionTitle icon={Phone} label="Contato" />
        <div className="patient-form-grid-2">
          <FormField
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <div className="relative">
                  <Phone className="patient-icon-prefix" />
                  <FormControl>
                    <Input
                      id="phoneNumber"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="(00) 00000-0000"
                      inputMode="numeric"
                      autoComplete="off"
                      className={cn('patient-input', 'pl-9 tabular-nums')}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <div className="relative">
                  <Mail className="patient-icon-prefix" />
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="paciente@email.com"
                      autoComplete="off"
                      className={cn(
                        'patient-input',
                        'pl-9',
                        fieldState.invalid &&
                          'border-red-600 focus-visible:ring-red-600/20',
                      )}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
