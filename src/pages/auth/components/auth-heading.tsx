import './auth-heading.css'

interface AuthHeadingProps {
  title: string
  subtitle: string
}

export function AuthHeading({ title, subtitle }: AuthHeadingProps) {
  return (
    <div className="auth-heading">
      <h1 className="auth-heading__title">{title}</h1>
      <p className="auth-heading__subtitle">{subtitle}</p>
    </div>
  )
}
