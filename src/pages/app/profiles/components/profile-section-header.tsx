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
        <span className="text-[11px] tracking-[.08em] font-bold text-muted-foreground uppercase">
          {section}
        </span>
        <h2 className="text-[19px] font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-[13.5px] text-muted-foreground">{label}</p>
    </div>
  )
}
