/**
 * Formata CPF progressivamente (XXX.XXX.XXX-XX)
 * Bloqueia em 11 dígitos numéricos.
 */
export function formatCPF(raw: string): string {
  if (!raw) return ""

  // Remove tudo que não é dígito e limita a 11 números
  const cleaned = raw.replace(/\D/g, "").slice(0, 11)

  // Aplica a máscara de acordo com a quantidade de números digitados
  return cleaned
    .replace(/(\d{3})(\d)/, "$1.$2")       // Primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2")       // Segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Traço
}