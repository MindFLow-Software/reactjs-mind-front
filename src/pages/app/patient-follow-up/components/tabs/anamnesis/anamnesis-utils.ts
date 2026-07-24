import type { IAnamnesis } from '@/types/clinical/anamnesis'
import type { IAnamnesisSection } from '@/types/clinical/anamnesis-section'
import type { ISaveAnamnesisBody } from '@/types/clinical/save-anamnesis-body'

export function emptySection(order = 0): IAnamnesisSection {
  return { id: crypto.randomUUID(), title: 'Nova Seção', content: '', order }
}

export function buildSectionsFromAnamnesis(
  anamnesis: IAnamnesis,
): IAnamnesisSection[] {
  return [...anamnesis.sections]
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({
      id: section.id,
      title: section.title,
      content: section.content,
      order: index,
    }))
}

export function normalizeSections(
  sections: IAnamnesisSection[],
): IAnamnesisSection[] {
  return sections.map((section, index) => ({
    id: section.id?.trim() || crypto.randomUUID(),
    title: section.title ?? '',
    content: section.content ?? '',
    order: index,
  }))
}

export function fingerprintSections(sections: IAnamnesisSection[]): string {
  return JSON.stringify(
    sections.map((section, index) => ({
      title: section.title.trim(),
      content: section.content,
      order: index,
    })),
  )
}

export function toSaveBody(
  sections: IAnamnesisSection[],
  serverIds: Set<string>,
  isDraft: boolean,
): ISaveAnamnesisBody {
  return {
    isDraft,
    sections: sections.map((section, index) => ({
      id: serverIds.has(section.id) ? section.id : null,
      title: section.title.trim(),
      content: section.content,
      order: index,
    })),
  }
}
