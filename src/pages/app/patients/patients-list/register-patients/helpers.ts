import type { PatientHTTP } from "@/types/patient"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { formatCEP } from "@/utils/formatCEP"
import type { PatientFormData } from "@/validators/patients"

export function buildPatientDefaults(patient?: PatientHTTP): PatientFormData {
    return {
        firstName:   patient?.firstName                              ?? "",
        lastName:    patient?.lastName                               ?? "",
        phoneNumber: patient?.phoneNumber ? formatPhone(patient.phoneNumber) : "",
        email:       patient?.email                                  ?? "",
        cpf:         patient?.cpf         ? formatCPF(patient.cpf)  : "",
        gender:      (patient?.gender     ?? "FEMININE") as PatientFormData["gender"],
        dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : null,
        cep:         patient?.cep         ? formatCEP(patient.cep)  : "",
        logradouro:  patient?.logradouro                             ?? "",
        bairro:      patient?.bairro                                 ?? "",
        cidade:      patient?.cidade                                 ?? "",
        uf:          patient?.uf                                     ?? "",
        modality:    "ONLINE",
        frequency:   "Semanal",
        price:       "",
        source:      "",
        notes:       "",
    }
}
