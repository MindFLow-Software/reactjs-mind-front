import type { AnamnesisData } from "@/api/patients/anamnesis"
import type { AnamnesisBlock, SerializedBlock } from "./anamnesis-types"

export const DYNAMIC_TEMPLATE_PREFIX = "__ANAMNESIS_BLOCKS_V1__:"
export const SINGLE_BLOCK_TITLE = "Anamnese"

export const ANAMNESIS_PLACEHOLDER = `Exemplos de estrutura:

- Queixa principal:
- História do problema atual:
- Contexto familiar e social:
- Antecedentes relevantes:
- Hipóteses clínicas:
- Plano terapêutico inicial:`

export function normalizeSingleEditorContent(content: string | undefined): string {
  if (!content) return ""
  return content.replace(/^(?:##\s*Anamnese\s*\n+)+/i, "").trim()
}

export function removeLeadingHeading(content: string | undefined): string {
  if (!content) return ""
  return content.replace(/^##\s*.+\n+/i, "").trim()
}

export function createBlock(raw: SerializedBlock, index: number): AnamnesisBlock {
  const cleanTitle = raw.title?.trim() || `Seção ${index + 1}`
  const normalizedContent = removeLeadingHeading(raw.content)
  return {
    id: raw.id?.trim() || crypto.randomUUID(),
    title: cleanTitle,
    content: normalizedContent,
  }
}

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

export function buildInitialBlocks(data: AnamnesisData): AnamnesisBlock[] {
  const raw = data.medicalHistory ?? ""

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

  const legacySections = [
    data.chiefComplaint ? `## Queixa Principal\n${data.chiefComplaint}` : "",
    data.familyHistory ? `## Histórico Familiar\n${data.familyHistory}` : "",
    data.personalHistory ? `## Histórico Pessoal\n${data.personalHistory}` : "",
    raw && !raw.startsWith(DYNAMIC_TEMPLATE_PREFIX) ? `## Histórico Médico\n${raw}` : "",
  ].filter(Boolean)

  return parseMarkdownBlocks(legacySections.join("\n\n"))
}

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
    chiefComplaint: buildContentFromBlocks(normalized),
    familyHistory: "",
    personalHistory: "",
    medicalHistory: serialized,
  }
}
