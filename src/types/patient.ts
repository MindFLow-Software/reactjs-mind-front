// @/types/entities/patient.ts

export type Gender = "MASCULINE" | "FEMININE" | "OTHER";

export interface RegisterPatientBody {
  firstName: string;
  lastName: string;
  gender: Gender;
  phoneNumber?: string | null;
  dateOfBirth?: Date | string | null;
  cpf?: string;
  profileImageUrl?: string | null;
}
