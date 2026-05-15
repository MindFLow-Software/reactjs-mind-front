export const Expertise = {
  OTHER:           'OTHER',
  SOCIAL:          'SOCIAL',
  INFANT:          'INFANT',
  CLINICAL:        'CLINICAL',
  JURIDICAL:       'JURIDICAL',
  EDUCATIONAL:     'EDUCATIONAL',
  ORGANIZATIONAL:  'ORGANIZATIONAL',
  PSYCHOTHERAPIST: 'PSYCHOTHERAPIST',
  NEUROPSYCHOLOGY: 'NEUROPSYCHOLOGY',
} as const
export type Expertise = (typeof Expertise)[keyof typeof Expertise]

export type PsychologistRole = 'PSYCHOLOGIST' | 'PATIENT'
export type PatientRole      = 'PATIENT'
