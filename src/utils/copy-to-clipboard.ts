import { toast } from 'sonner'
import { is } from './isness'

export const copyToClipboard = (value: string) => {
  if (!value || is.emptyString(value)) {
    toast.warning('Nada para copiar.')
    return
  }

  navigator.clipboard.writeText(value)
  toast.success('Copiado para a área de transferência.')
}
