import './auth-divider.css'

type IAuthDivider = {
  label: string
}

export function AuthDivider({ label }: IAuthDivider) {
  return (
    <div className="auth-divider-root">
      <span className="auth-divider-line" />
      <span className="auth-divider-label">{label}</span>
    </div>
  )
}
