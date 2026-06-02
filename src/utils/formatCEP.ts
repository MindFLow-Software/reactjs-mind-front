// formatCEP.ts
/**
 * Formata CEP para XXXXX-XXX
 * Recebe qualquer string (com ou sem máscara) e retorna a string formatada.
 * Se não for um CEP válido (8 dígitos), retorna a string limpa (somente números).
 */
export function formatCEP(raw: string | null | undefined): string {
    if (!raw) return ''
    const cleaned = String(raw).replace(/\D/g, '')

    if (/^\d{8}$/.test(cleaned)) {
        return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2')
    }

    // fallback: retorna somente os números (ou você pode retornar raw)
    return cleaned
}
