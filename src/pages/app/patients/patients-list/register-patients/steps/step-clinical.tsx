import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { Activity, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import './step-clinical.css'
import type { PatientFormData } from '@/validators/patients'
import { MODALITY_OPTIONS } from '../constants'
import { SectionTitle } from './section-title'
import { PillRadio } from './pill-radio'
import { MarkdownEditor } from './markdown-editor'

const FREQUENCY_OPTIONS = ['Semanal', 'Quinzenal', 'Mensal', 'Sob demanda']

export function StepClinical() {
  const { control } = useFormContext<PatientFormData>()

  const handlePriceChange = useCallback(
    (value: string, fieldOnChange: (v: string) => void) => {
      fieldOnChange(value.replace(/[^\d,]/g, ''))
    },
    [],
  )

  return (
    <div className="space-y-4">
      {/* Atendimento */}
      <div>
        <SectionTitle icon={Activity} label="Atendimento" />
        <div className="rp-clinical-grid">
          <FormField
            control={control}
            name="modality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade</FormLabel>
                <FormControl>
                  <PillRadio
                    name="modality"
                    options={MODALITY_OPTIONS}
                    value={field.value ?? 'ONLINE'}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência</FormLabel>
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn('patient-input', 'cursor-pointer')}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da sessão</FormLabel>
                <div className="relative">
                  <span className="rp-price-prefix">R$</span>
                  <FormControl>
                    <Input
                      value={field.value ?? ''}
                      onChange={(e) =>
                        handlePriceChange(e.target.value, field.onChange)
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="180,00"
                      inputMode="decimal"
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
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indicação</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Como conheceu? (opcional)"
                    className={'patient-input'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Notas clínicas */}
      <div>
        <SectionTitle icon={FileText} label="Queixa principal & observações" />
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MarkdownEditor
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
