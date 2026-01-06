import { toast } from "sonner"

/**
 * Faz o download de um arquivo a partir de uma URL, forçando o download 
 * no navegador e permitindo definir o nome do arquivo final.
 * * @param url - URL pública do arquivo (ex: Cloudflare R2)
 * @param filename - Nome que o arquivo terá ao ser salvo no computador
 */

export async function handleFileDownload(url: string, filename: string) {
    try {
        const response = await fetch(url)
        
        if (!response.ok) throw new Error('Falha ao buscar arquivo')

        const blob = await response.blob()
        
        const blobUrl = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        
        document.body.appendChild(link)
        link.click()
        
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
        
    } catch (error) {
        console.error("Erro no download:", error)
        toast.error("Não foi possível processar o download. Abrindo em nova aba...")
        
        window.open(url, '_blank', 'noopener,noreferrer')
    }
}