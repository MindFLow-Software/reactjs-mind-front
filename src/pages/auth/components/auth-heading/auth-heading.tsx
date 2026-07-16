import './auth-heading.css'

type IAuthHeading = {
  title: string
  subtitle: string
}

export function AuthHeading({ title, subtitle }: IAuthHeading) {
  return (
    <div className="auth-heading">
      <h1 className="auth-heading__title">{title}</h1>
      <p className="auth-heading__subtitle">{subtitle}</p>
    </div>
  )
}
