import './patient-info-field.css'
import { IMaskMixin } from 'react-imask'
import type { InputHTMLAttributes, Ref } from 'react'

const MaskedInfo = IMaskMixin(
  ({
    inputRef,
    ...props
  }: {
    inputRef: Ref<HTMLInputElement>
  } & InputHTMLAttributes<HTMLInputElement>) => (
    <input ref={inputRef} disabled className="pdd-field-masked" {...props} />
  ),
)

type IPatientInfoField = {
  value?: string | null
  mask?: string
}

export function PatientInfoField({ value, mask }: IPatientInfoField) {
  if (!value || value.trim() === '') {
    return <span className="pdd-field-empty">Não informado</span>
  }

  if (mask) {
    return <MaskedInfo mask={mask} value={value} />
  }

  return <span className="pdd-field-value">{value}</span>
}
