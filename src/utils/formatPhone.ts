/**
 * Formata telefone brasileiro progressivamente (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * Bloqueia em 11 dígitos numéricos e ajusta a máscara dinamicamente.
 */
export function formatPhone(raw: string): string {
  if (!raw) return ""

  // Remove tudo que não é número e limita a 11 dígitos
  const cleaned = raw.replace(/\D/g, "").slice(0, 11)

  const len = cleaned.length

  // Aplica a máscara de acordo com a quantidade de números
  if (len <= 10) {
    // Formato Fixo: (XX) XXXX-XXXX
    return cleaned
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }

  // Formato Celular: (XX) XXXXX-XXXX
  return cleaned
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}