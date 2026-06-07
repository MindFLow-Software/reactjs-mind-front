import type { ReactNode } from 'react'

import './patient-details-shell.css'

interface ShellChildProps {
  children: ReactNode
}

function PatientDetailsShellRoot({ children }: ShellChildProps) {
  return <div className="ph-shell">{children}</div>
}

function Header({ children }: ShellChildProps) {
  return <div className="ph-shell__header">{children}</div>
}

function Content({ children }: ShellChildProps) {
  return <div className="ph-shell__content">{children}</div>
}

export const PatientDetailsShell = Object.assign(PatientDetailsShellRoot, {
  Header,
  Content,
})
