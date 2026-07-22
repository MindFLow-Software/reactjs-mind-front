import { env } from '@/env'
import { OAuthProvider } from '@/types/auth/oauth-provider'

export function oauthAuthenticate(provider: OAuthProvider): void {
  window.location.href = `${env.VITE_API_URL}/auth/${provider}`
}
