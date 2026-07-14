import { Honorific } from '@/types/shared/enums'

export const translatedHonorific: Record<Honorific, string> = {
  [Honorific.MASC_DR]: 'Dr.',
  [Honorific.FEMININE_DR]: 'Dra.',
  [Honorific.MSC]: 'MSc.',
  [Honorific.PHD]: 'PhD',
}
