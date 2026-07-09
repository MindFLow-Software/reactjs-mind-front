import { addDays, formatISO } from 'date-fns'

import type { IPatientProfile } from '@/types/patient-profile'
import type { IDashboardGoal } from '@/pages/app/dashboard/shared/types'
import {
  SessionModality,
  type IPatientJournalEntry,
  type IPatientNextSession,
  type IPatientPsychologistCard,
} from '../types'

export interface IPatientDashboardMock {
  nextSession: IPatientNextSession | null
  goals: IDashboardGoal[]
  journal: IPatientJournalEntry[]
  psychologists: IPatientPsychologistCard[]
}

const GOALS: IDashboardGoal[] = [
  {
    key: 'anxiety',
    label: 'Controlar a ansiedade',
    value: 68,
    target: 100,
    unit: '%',
  },
  {
    key: 'balance',
    label: 'Encontrar equilíbrio',
    value: 45,
    target: 100,
    unit: '%',
  },
  {
    key: 'sleep',
    label: 'Dormir melhor',
    value: 72,
    target: 100,
    unit: '%',
  },
]

const JOURNAL: IPatientJournalEntry[] = [
  {
    id: 'journal-1',
    date: formatISO(addDays(new Date(), -1), { representation: 'date' }),
    title: 'Uma semana mais leve',
    excerpt:
      'Consegui aplicar a respiração guiada antes de uma reunião difícil e me senti mais no controle.',
  },
  {
    id: 'journal-2',
    date: formatISO(addDays(new Date(), -4), { representation: 'date' }),
    title: 'Dia difícil, mas produtivo',
    excerpt:
      'Anotei os gatilhos de ansiedade do dia para conversar na próxima sessão.',
  },
  {
    id: 'journal-3',
    date: formatISO(addDays(new Date(), -8), { representation: 'date' }),
    title: 'Rotina de sono',
    excerpt:
      'Comecei a desligar as telas uma hora antes de dormir, como combinado na sessão.',
  },
]

const RECOMMENDED_PSYCHOLOGISTS: IPatientPsychologistCard[] = [
  {
    id: 'psy-mock-1',
    name: 'Dra. Camila Nogueira',
    avatarUrl: null,
    specialty: 'Terapia cognitivo-comportamental',
    rating: 4.9,
    pricePerSession: 18000,
    isLinked: false,
  },
  {
    id: 'psy-mock-2',
    name: 'Dr. Rafael Souza',
    avatarUrl: null,
    specialty: 'Terapia sistêmica',
    rating: 4.7,
    pricePerSession: 15000,
    isLinked: false,
  },
  {
    id: 'psy-mock-3',
    name: 'Dra. Beatriz Lima',
    avatarUrl: null,
    specialty: 'Psicanálise',
    rating: 4.8,
    pricePerSession: 20000,
    isLinked: false,
  },
]

function buildNextSession(
  profile: IPatientProfile,
): IPatientNextSession | null {
  if (!profile.psychologistPracticeContextId) {
    return null
  }

  return {
    date: formatISO(addDays(new Date(), 2)),
    psychologistName: 'Dra. Camila Nogueira',
    psychologistAvatarUrl: null,
    durationMinutes: 50,
    modality: SessionModality.ONLINE,
  }
}

function buildPsychologists(
  profile: IPatientProfile,
): IPatientPsychologistCard[] {
  if (!profile.psychologistPracticeContextId) {
    return RECOMMENDED_PSYCHOLOGISTS
  }

  return [
    {
      id: 'psy-linked-1',
      name: 'Dra. Camila Nogueira',
      avatarUrl: null,
      specialty: 'Terapia cognitivo-comportamental',
      rating: 4.9,
      pricePerSession: 18000,
      isLinked: true,
    },
  ]
}

export function buildPatientMock(
  profile: IPatientProfile,
): IPatientDashboardMock {
  return {
    nextSession: buildNextSession(profile),
    goals: GOALS,
    journal: JOURNAL,
    psychologists: buildPsychologists(profile),
  }
}
