import { Gender, type Ipatient } from '@/types/patient'
import { formatCPF } from '@/utils/formatCPF'
import { formatCEP } from '@/utils/formatCEP'
import { formatPhone } from '@/utils/formatPhone'
import type { PatientFormData } from '@/validators/patients'

export function buildPatientDefaults(
  patient: Ipatient | null,
): PatientFormData {
  return {
    firstName: patient?.firstName ?? '',
    lastName: patient?.lastName ?? '',
    phoneNumber: patient?.phoneNumber ? formatPhone(patient.phoneNumber) : '',
    email: patient?.email ?? '',
    cpf: patient?.cpf ? formatCPF(patient.cpf) : '',
    gender: patient?.gender ?? Gender.OTHER,
    dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : null,
    zipCode: formatCEP(patient?.zipCode) ?? '',
    street: patient?.street ?? '',
    number: patient?.number ?? '',
    neighborhood: patient?.neighborhood ?? '',
    complement: patient?.complement ?? '',
    city: patient?.city ?? '',
    state: patient?.state ?? '',
    modality: 'ONLINE',
    frequency: 'Semanal',
    price: '',
    source: '',
    notes: '',
  }
}
