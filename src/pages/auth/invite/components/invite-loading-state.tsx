import { Loader2 } from 'lucide-react'

import './invite-loading-state.css'

export function InviteLoadingState() {
  return (
    <main className="inv-loading-shell">
      <div className="inv-loading-content">
        <Loader2 className="animate-spin" size={20} />
        <p>Aguarde, estamos encontrando e validando o seu convite...</p>
      </div>
    </main>
  )
}
