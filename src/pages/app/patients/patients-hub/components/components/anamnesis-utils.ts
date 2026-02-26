import type { AnamnesisData } from "@/api/anamnesis"
import type { AnamnesisBlock, SerializedBlock } from "./types"

export const DYNAMIC_TEMPLATE_PREFIX = "__ANAMNESIS_BLOCKS_V1__:"
export const SINGLE_BLOCK_TITLE = "Anamnese"

export const ANAMNESIS_PLACEHOLDER = `Exemplos de estrutura:

- Queixa principal:
- História do problema atual:
- Contexto familiar e social:
- Antecedentes relevantes:
- Hipóteses clínicas:
- Plano terapêutico inicial:`

/**
 * Limpa títulos repetidos de editores simples
 */
export function normalizeSingleEditorContent(content: string | undefined): string {
  if (!content) return ""
  return content.replace(/^(?:##\s*Anamnese\s*\n+)+/i, "").trim()
}

/**
 * Remove o primeiro cabeçalho Markdown de uma string
 */
export function removeLeadingHeading(content: string | undefined): string {
  if (!content) return ""
  return content.replace(/^##\s*.+\n+/i, "").trim()
}

/**
 * Cria um objeto de bloco padronizado
 */
export function createBlock(raw: SerializedBlock, index: number): AnamnesisBlock {
  const cleanTitle = raw.title?.trim() || `Seção ${index + 1}`
  const normalizedContent = removeLeadingHeading(raw.content)
  return {
    id: raw.id?.trim() || crypto.randomUUID(),
    title: cleanTitle,
    content: normalizedContent,
  }
}

/**
 * Transforma uma string Markdown (com ##) em um array de blocos
 */
export function parseMarkdownBlocks(content: string): AnamnesisBlock[] {
  if (!content.trim()) {
    return [{ id: crypto.randomUUID(), title: SINGLE_BLOCK_TITLE, content: "" }]
  }

  const matches = Array.from(content.matchAll(/^##\s+(.+)$/gm))
  
  if (matches.length === 0) {
    return [
      {
        id: crypto.randomUUID(),
        title: SINGLE_BLOCK_TITLE,
        content: normalizeSingleEditorContent(content),
      },
    ]
  }

  const blocks: AnamnesisBlock[] = []
  matches.forEach((match, index) => {
    const headingStart = match.index ?? 0
    const heading = match[0]
    const title = match[1]?.trim() || `Seção ${index + 1}`
    const bodyStart = headingStart + heading.length
    const nextHeadingStart = matches[index + 1]?.index ?? content.length
    const body = content.slice(bodyStart, nextHeadingStart).replace(/^\n+/, "").trim()

    blocks.push({
      id: crypto.randomUUID(),
      title,
      content: body,
    })
  })

  return blocks
}

/**
 * Reconstrói os blocos a partir dos dados da API (Suporta legado e o novo formato JSON)
 */
export function buildInitialBlocks(data: AnamnesisData): AnamnesisBlock[] {
  const raw = data.medicalHistory ?? ""

  // 1. Tenta carregar o novo formato serializado (JSON no campo medicalHistory)
  if (raw.startsWith(DYNAMIC_TEMPLATE_PREFIX)) {
    try {
      const parsed = JSON.parse(raw.slice(DYNAMIC_TEMPLATE_PREFIX.length)) as SerializedBlock[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((block, index) => createBlock(block, index))
      }
    } catch (e) {
      console.error("Erro ao fazer parse dos blocos dinâmicos:", e)
    }
  }

  // 2. Fallback: Concatena campos legados (se existirem) para não perder dados antigos
  const legacySections = [
    data.chiefComplaint ? `## Queixa Principal\n${data.chiefComplaint}` : "",
    data.familyHistory ? `## Histórico Familiar\n${data.familyHistory}` : "",
    data.personalHistory ? `## Histórico Pessoal\n${data.personalHistory}` : "",
    raw && !raw.startsWith(DYNAMIC_TEMPLATE_PREFIX) ? `## Histórico Médico\n${raw}` : "",
  ].filter(Boolean)

  return parseMarkdownBlocks(legacySections.join("\n\n"))
}

/**
 * Garante que a lista de blocos nunca esteja vazia e esteja limpa
 */
export function normalizeBlocks(blocks: AnamnesisBlock[]): AnamnesisBlock[] {
  if (blocks.length === 0) {
    return [{ id: crypto.randomUUID(), title: SINGLE_BLOCK_TITLE, content: "" }]
  }

  return blocks.map((block, index) => ({
    id: block.id || crypto.randomUUID(),
    title: block.title.trim() || `Seção ${index + 1}`,
    content: block.content,
  }))
}

/**
 * Gera uma string Markdown legível a partir dos blocos (para PDF e Copiar)
 */
export function buildContentFromBlocks(blocks: AnamnesisBlock[]): string {
  return blocks
    .map((block, index) => {
      const title = block.title.trim() || `Seção ${index + 1}`
      const body = block.content.trim()
      return body ? `## ${title}\n${body}` : `## ${title}`
    })
    .join("\n\n")
    .trim()
}

/**
 * Converte o estado atual para o formato que a API espera receber
 */
export function toApiData(blocks: AnamnesisBlock[]): AnamnesisData {
  const normalized = normalizeBlocks(blocks)
  const serialized = `${DYNAMIC_TEMPLATE_PREFIX}${JSON.stringify(
    normalized.map((block, index) => ({
      id: block.id,
      title: block.title.trim() || `Seção ${index + 1}`,
      content: block.content,
    })),
  )}`

  return {
    chiefComplaint: buildContentFromBlocks(normalized), // Usado para visualização rápida no admin/legado
    familyHistory: "",
    personalHistory: "",
    medicalHistory: serialized, // Onde guardamos a estrutura completa
  }
}