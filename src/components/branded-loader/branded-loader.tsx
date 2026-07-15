import { Brain } from 'lucide-react'

import './branded-loader.css'

type IBrandedLoader = {
  message?: string
}

export function BrandedLoader({ message = 'Carregando...' }: IBrandedLoader) {
  return (
    <div className="bl-root">
      <Brain className="size-10 text-blue-600" />
      <div className="bl-spinner" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
