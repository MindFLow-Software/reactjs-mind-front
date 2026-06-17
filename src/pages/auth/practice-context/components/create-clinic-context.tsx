import { Repeat2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

type IcreateClinicContext = {
  onGoBack: () => void
}

export function CreateClinicContext({ onGoBack }: IcreateClinicContext) {
  return (
    <div>
      <Button
        onClick={onGoBack}
        className="text-black bg-transparent border-none hover:bg-transparent gap-1"
      >
        <Repeat2 size={16} />
        Trocar contexto
      </Button>
    </div>
  )
}
