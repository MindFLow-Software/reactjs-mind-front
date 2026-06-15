import type { GetMeResponse } from '@/api/psychologists/get-profile'

export type PracticeContextMe = GetMeResponse['practiceContexts'][number]
export type PatientProfileMe = GetMeResponse['patientProfiles'][number]

export const EXPERTISE_OPTIONS = [
  { value: 'CLINICAL', label: 'Clínica' },
  { value: 'PSYCHOTHERAPIST', label: 'Psicoterapia' },
  { value: 'NEUROPSYCHOLOGY', label: 'Neuropsicologia' },
  { value: 'INFANT', label: 'Infantil' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'JURIDICAL', label: 'Jurídica' },
  { value: 'EDUCATIONAL', label: 'Educacional' },
  { value: 'ORGANIZATIONAL', label: 'Organizacional' },
  { value: 'OTHER', label: 'Outra' },
] as const

export const CONTEXT_TYPE_OPTIONS = [
  { value: 'INDIVIDUAL', label: 'Atendimento individual' },
  { value: 'CLINIC', label: 'Clínica' },
] as const

export const CONTEXT_TYPE_LABELS: Record<string, string> = {
  INDIVIDUAL: 'Atendimento individual',
  CLINIC: 'Clínica',
}
