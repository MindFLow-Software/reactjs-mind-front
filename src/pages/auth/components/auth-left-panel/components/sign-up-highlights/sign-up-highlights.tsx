import './sign-up-highlights.css'

const SIGN_UP_STEPS = [
  {
    order: 1,
    title: 'Crie sua conta',
    description: 'Preencha seus dados profissionais',
  },
  {
    order: 2,
    title: 'Configure seu espaço',
    description: 'Personalize agenda e horários',
  },
  {
    order: 3,
    title: 'Comece a atender',
    description: 'Seus pacientes já podem agendar',
  },
]

export function SignUpHighlights() {
  return (
    <div className="suh-root">
      <div className="suh-intro">
        <h2 className="suh-title">Comece em 3 passos</h2>
        <p className="suh-subtitle">
          Cadastre-se e transforme sua prática clínica com a MindFlush.
        </p>
      </div>

      <div className="suh-steps">
        {SIGN_UP_STEPS.map((step) => (
          <div key={step.order} className="suh-step">
            <span className="suh-step-order">{step.order}</span>
            <div>
              <p className="suh-step-title">{step.title}</p>
              <p className="suh-step-description">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
