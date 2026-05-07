import { memo } from "react"
import { useLocation } from "react-router-dom"
import { BrainIcon } from "@phosphor-icons/react"

function SignInContent() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white leading-snug">
          Bem-vindo de volta
        </h2>
        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
          Acesse seu painel e acompanhe seus pacientes com clareza e conexão.
        </p>
      </div>

      <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/10">
        <p className="text-sm text-white/80 italic leading-relaxed">
          "A saúde mental é o alicerce de tudo. Nossa plataforma existe para que você possa focar no que importa: as pessoas."
        </p>
        <p className="mt-3 text-xs text-white/40 font-medium tracking-wide">
          — Equipe MindFlush
        </p>
      </div>

      <div className="flex gap-6">
        {[
          { value: "500+", label: "Psicólogos ativos" },
          { value: "12k+", label: "Sessões realizadas" },
          { value: "98%",  label: "Satisfação" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-xl font-bold text-white">{stat.value}</span>
            <span className="text-[11px] text-white/40 leading-tight">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SignUpContent() {
  const steps = [
    { n: 1, title: "Crie sua conta",       desc: "Preencha seus dados profissionais" },
    { n: 2, title: "Configure seu espaço", desc: "Personalize agenda e horários"     },
    { n: 3, title: "Comece a atender",     desc: "Seus pacientes já podem agendar"   },
  ]

  return (
    <div className="flex flex-1 flex-col justify-center gap-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white leading-snug">
          Comece em 3 passos
        </h2>
        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
          Cadastre-se e transforme sua prática clínica com a MindFlush.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <div
            key={step.n}
            className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/25 text-sm font-bold text-blue-300">
              {step.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{step.title}</p>
              <p className="text-xs text-white/50">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const AuthLeftPanel = memo(function AuthLeftPanel() {
  const { pathname } = useLocation()
  const isSignUp = pathname.startsWith("/sign-up")

  return (
    <div
      aria-hidden="true"
      className="hidden md:flex flex-col h-full min-h-screen p-10 bg-gradient-to-br from-[#0e1b3e] via-[#16306b] to-[#1c3c8a]"
    >
      <div className="flex items-center gap-3">
        <BrainIcon className="h-8 w-8 text-blue-400" weight="duotone" />
        <span className="text-lg font-semibold text-white">MindFlush</span>
      </div>

      {isSignUp ? <SignUpContent /> : <SignInContent />}

      <footer className="text-xs text-white/30 text-center">
        Painel central &copy; MindFlush {new Date().getFullYear()}
      </footer>
    </div>
  )
})
