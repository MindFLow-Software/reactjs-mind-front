import { env } from '@/env'

export type IOAuthProvider = 'google' | 'linkedin'

export function authenticateWithOAuth(provider: IOAuthProvider): void {
  window.location.href = `${env.VITE_API_URL}/auth/${provider}`
}
