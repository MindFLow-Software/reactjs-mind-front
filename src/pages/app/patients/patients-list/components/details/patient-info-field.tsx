import { IMaskMixin } from 'react-imask'

const MaskedInfo = IMaskMixin(
  ({
    inputRef,
    ...props
  }: {
    inputRef: React.Ref<HTMLInputElement>
  } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input ref={inputRef} disabled className="pdd-field-masked" {...props} />
  ),
)

interface PatientInfoFieldProps {
  value?: string | null
  mask?: string
}

export function PatientInfoField({ value, mask }: PatientInfoFieldProps) {
  if (!value || value.trim() === '') {
    return <span className="pdd-field-empty">Não informado</span>
  }

  if (mask) {
    return <MaskedInfo mask={mask} value={value} />
  }

  return <span className="pdd-field-value">{value}</span>
}
