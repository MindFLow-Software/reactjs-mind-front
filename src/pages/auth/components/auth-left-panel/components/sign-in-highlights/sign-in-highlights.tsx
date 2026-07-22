import './sign-in-highlights.css'

const SIGN_IN_STATS = [
  { value: '500+', label: 'Psicólogos ativos' },
  { value: '12k+', label: 'Sessões realizadas' },
  { value: '98%', label: 'Satisfação' },
]

export function SignInHighlights() {
  return (
    <div className="sih-root">
      <div className="sih-intro">
        <h2 className="sih-title">Bem-vindo de volta</h2>
        <p className="sih-subtitle">
          Acesse seu painel e acompanhe seus pacientes com clareza e conexão.
        </p>
      </div>

      <div className="sih-quote">
        <p className="sih-quote-text">
          &quot;A saúde mental é o alicerce de tudo. Nossa plataforma existe
          para que você possa focar no que importa: as pessoas.&quot;
        </p>
        <p className="sih-quote-author">— Equipe MindFlush</p>
      </div>

      <div className="sih-stats">
        {SIGN_IN_STATS.map((stat) => (
          <div key={stat.label} className="sih-stat">
            <span className="sih-stat-value">{stat.value}</span>
            <span className="sih-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
