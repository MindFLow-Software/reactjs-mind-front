import { OAuthError } from '@/types/auth/oauth-error'

import { OAUTH_ERROR_MESSAGES } from './constants'

export function resolveOAuthErrorMessage(value: string | null): string | null {
  if (!value) return null

  const knownError = Object.values(OAuthError).find((error) => error === value)

  return OAUTH_ERROR_MESSAGES[knownError ?? OAuthError.FAILED]
}
