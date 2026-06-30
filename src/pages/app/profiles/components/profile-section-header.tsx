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
    <div className="space-y-1 mb-4">
      <div>
        <span className="text-xs tracking-wider font-medium text-muted-foreground uppercase">{section}</span>
        <h1 className="text-xl text-foreground">{title}</h1>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
