import { Venus, Mars, Users } from 'lucide-react'
import { Gender } from '@/types/shared/enums'
import {
  RegisterPatientTab,
  type IRegisterStep,
} from '../../../patients-list.types'

export const STEPS: readonly IRegisterStep[] = [
  {
    id: 1,
    label: 'Dados básicos',
    required: true,
    key: RegisterPatientTab.BASIC_DATA,
  },
  {
    id: 2,
    label: 'Contato',
    required: false,
    key: RegisterPatientTab.CONTACT,
  },
  {
    id: 3,
    label: 'Documentos',
    required: false,
    key: RegisterPatientTab.DOCUMENTS,
  },
]

export const GENDER_OPTIONS = [
  {
    value: Gender.FEMININE,
    label: 'Feminino',
    icon: Venus,
    checkedCls:
      'border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950/40 dark:text-pink-300',
  },
  {
    value: Gender.MASCULINE,
    label: 'Masculino',
    icon: Mars,
    checkedCls:
      'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
  },
  {
    value: Gender.OTHER,
    label: 'Outro / Prefiro não dizer',
    icon: Users,
    checkedCls:
      'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300',
  },
] as const

export const MAX_DOC_FILES = 6
export const MAX_DOC_SIZE = 3 * 1024 * 1024
