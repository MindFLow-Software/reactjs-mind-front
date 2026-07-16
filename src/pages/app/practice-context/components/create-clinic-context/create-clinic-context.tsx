import '../practice-context-shared.css'
import { Repeat2 } from 'lucide-react'

import type { ICreatePracticeContextBody } from '@/types/psychologist/create-practice-context-body'

type ICreateClinicContext = {
  onGoBack: () => void
  onCreatePracticeContext: (data: ICreatePracticeContextBody) => void
}

export function CreateClinicContext({ onGoBack }: ICreateClinicContext) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted/30 px-4 text-center">
      <button type="button" onClick={onGoBack} className="pc-switch">
        <Repeat2 size={15} />
        Trocar contexto
      </button>
      <h1 className="text-2xl font-bold text-foreground">Contexto clínico</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Em breve. Esta área está em construção.
      </p>
    </div>
  )
}
