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

export const MAX_DOC_FILES = 6
export const MAX_DOC_SIZE = 3 * 1024 * 1024
