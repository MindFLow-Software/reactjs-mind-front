import z from 'zod'

export const createPatientProfileByAccessCodeSchema = z.object({
  accessCode: z.string().optional(),
})

export type CreatePatientProfileByAccessCodeData = z.infer<
  typeof createPatientProfileByAccessCodeSchema
>
