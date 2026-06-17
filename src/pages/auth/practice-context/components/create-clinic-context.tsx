import { Repeat2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { CreatePracticeContextBody } from '@/types/psychologist'

type IcreateClinicContext = {
  onGoBack: () => void
  onCreatPracticeContext: (data: CreatePracticeContextBody) => void
}

export function CreateClinicContext({ onGoBack }: IcreateClinicContext) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted/30 px-4 text-center">
      <Button
        onClick={onGoBack}
        className="text-black bg-transparent border-none hover:bg-transparent gap-1"
      >
        <Repeat2 size={16} />
        Trocar contexto
      </Button>
      <h1 className="text-2xl font-bold text-foreground">Contexto clínico</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Em breve. Esta área está em construção.
      </p>
    </div>
  )
}
