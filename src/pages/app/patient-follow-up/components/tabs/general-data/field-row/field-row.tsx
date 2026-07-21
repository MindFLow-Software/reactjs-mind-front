import './field-row.css'

type IFieldRow = {
  label: string
  value: React.ReactNode
}

export function FieldRow({ label, value }: IFieldRow) {
  return (
    <div className="gd-field">
      <span className="gd-field__label">{label}</span>
      <div className="gd-field__box">{value}</div>
    </div>
  )
}
