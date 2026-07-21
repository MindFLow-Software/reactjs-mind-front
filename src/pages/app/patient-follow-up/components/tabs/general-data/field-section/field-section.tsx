import './field-section.css'

type IFieldSection = {
  label: string
  children: React.ReactNode
}

export function FieldSection({ label, children }: IFieldSection) {
  return (
    <section className="gd-section">
      <h3 className="gd-section__label">{label}</h3>
      <div className="gd-section__grid">{children}</div>
    </section>
  )
}
