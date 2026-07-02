import z from 'zod'

export const createPatientProfileByAccessCodeSchema = z.object({
  accessCode: z.string().optional(),
})

export type IcreatePatientProfileByAccessCode = z.infer<
  typeof createPatientProfileByAccessCodeSchema
>
