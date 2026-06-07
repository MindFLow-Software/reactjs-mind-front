import { useCallback, useState } from 'react'
import type { Dispatch, ReactElement, SetStateAction } from 'react'
import { pdf } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import { toast } from 'sonner'

interface UsePdfExportOptions {
  receivedFilename?: string
}

interface UsePdfExportReturn {
  isExporting: boolean
  pdfExportedSuccessfully: boolean
  setFilename: Dispatch<SetStateAction<string | undefined>>
  exportToPdf: (document: ReactElement) => Promise<void>
}

export function usePdfExport({
  receivedFilename,
}: UsePdfExportOptions = {}): UsePdfExportReturn {
  const [isExporting, setIsExporting] = useState(false)
  const [filename, setFilename] = useState(receivedFilename)
  const [pdfExportedSuccessfully, setPdfExportedSuccessfully] = useState(false)

  const exportToPdf = useCallback(
    async (document: ReactElement) => {
      setIsExporting(true)
      try {
        if (!filename) {
          throw new Error('Erro ao gerar PDF, nome do arquivo não informado.')
        }

        const blob = await pdf(document as ReactElement<DocumentProps>).toBlob()
        const url = URL.createObjectURL(blob)
        const link = window.document.createElement('a')
        link.href = url
        link.download = filename
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success('PDF pronto! O download foi concluído.')
        setPdfExportedSuccessfully(true)
      } catch (error) {
        const errorMessage = (error as Error)?.message ?? 'Erro ao gerar PDF.'
        toast.error(errorMessage)
      } finally {
        setIsExporting(false)
      }
    },
    [filename],
  )

  return {
    isExporting,
    exportToPdf,
    setFilename,
    pdfExportedSuccessfully,
  }
}
