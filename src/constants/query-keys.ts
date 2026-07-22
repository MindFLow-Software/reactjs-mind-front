export const queryKeys = {
  me: ['me'] as const,
  profile: ['profile'] as const,
  patients: (params?: Record<string, unknown>) => ['patients', params] as const,
  patient: (patientId: string) => ['patient', patientId] as const,
  patientDetails: (patientId: string) =>
    ['patient-details', patientId] as const,
  attachments: (patientId: string) => ['attachments', patientId] as const,
  appointments: (params?: Record<string, unknown>) =>
    ['appointments', params] as const,
  dashboard: ['dashboard'] as const,
  suggestions: (params?: Record<string, unknown>) =>
    ['suggestions', params] as const,
  availability: ['availability'] as const,
  popups: ['popups'] as const,
  psychologists: (params?: Record<string, unknown>) =>
    ['psychologists', params] as const,
  claimCandidates: ['claim-candidates'] as const,
  claimRequests: ['claim-requests'] as const,
  claimRequest: (claimRequestId: string | null) =>
    ['claim-request', claimRequestId] as const,
  patientInvite: (token: string | undefined) =>
    ['patient-invite', token] as const,
  registrationLink: (hash: string | undefined) =>
    ['registration-links', hash] as const,
} as const
