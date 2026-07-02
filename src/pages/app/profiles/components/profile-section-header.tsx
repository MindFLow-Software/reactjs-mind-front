import './profile-section-header.css'

type IProfileSectionHeader = {
  section: string
  title: string
  label: string
}

export function ProfileSectionHeader({
  title,
  label,
  section,
}: IProfileSectionHeader) {
  return (
    <div className="pf-section-wrap">
      <div>
        <span className="pf-section-eyebrow">{section}</span>
        <h1 className="pf-section-title">{title}</h1>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
