import { getAttachmentBlob } from '@/api/attachments/get-attachment-blob'

export async function handleFileDownload(fileKey: string, filename: string) {
  try {
    const blob = await getAttachmentBlob(fileKey)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', filename) // Garante o nome original com acento
    document.body.appendChild(link)
    link.click()

    // Limpeza necessária
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao processar download:', error)
  }
}
