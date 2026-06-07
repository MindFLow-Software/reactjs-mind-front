export const PATIENT_QUEUE_STORAGE_KEY = 'active_patient_queue' as const
export const PATIENT_QUEUE_SOURCE_KEY = 'active_patient_queue_source' as const
export const ANAMNESIS_DRAFT_KEY_PREFIX = 'anamnesis-draft:' as const

export type TabId = 'clinical' | 'anamnesis' | 'timeline' | 'files' | 'resume'

export const TAB_IDS = [
  'clinical',
  'anamnesis',
  'timeline',
  'files',
  'resume',
] as const
