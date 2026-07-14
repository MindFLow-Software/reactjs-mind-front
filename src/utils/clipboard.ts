import { toast } from 'sonner'
import { is } from './isness'

export class Clipboard {
  static copy = (value: string | null | undefined) => {
    if (!value || is.emptyString(value)) {
      toast.warning('Nada para copiar.')
      return
    }

    navigator.clipboard.writeText(value)
    toast.success('Copiado para a área de transferência.')
  }
}
