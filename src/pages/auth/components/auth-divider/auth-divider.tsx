import './auth-divider.css'

type IAuthDivider = {
  label: string
}

export function AuthDivider({ label }: IAuthDivider) {
  return (
    <div className="ad-root">
      <span className="ad-line" />
      <span className="ad-label">{label}</span>
    </div>
  )
}
