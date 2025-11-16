import { api } from "@/lib/axios";

export interface PatientsByGenderResponse {
  gender: string;
  patients: number;
}

interface GetPatientsByGenderParams {
  startDate?: string;
  endDate?: string;
}

export async function getPatientsByGender(
  params: GetPatientsByGenderParams
): Promise<PatientsByGenderResponse[]> {
  const { startDate, endDate } = params;

  const response = await api.get<PatientsByGenderResponse[]>("/patients/stats/gender", {
    params: { startDate, endDate },
  });

  return response.data;
}
