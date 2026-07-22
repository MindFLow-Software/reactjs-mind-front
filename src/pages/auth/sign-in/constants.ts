import { OAuthError } from '@/types/auth/oauth-error'

export const OAUTH_ERROR_PARAM = 'oauth-error'

export const OAUTH_ERROR_MESSAGES: Record<OAuthError, string> = {
  [OAuthError.PROVIDER_CONFLICT]:
    'Não foi possível concluir o login com este método. Tente utilizar outra forma de acesso vinculada à sua conta.',
  [OAuthError.ACCOUNT_INACTIVE]:
    'Não foi possível concluir o login. Entre em contato com o suporte caso acredite que isso seja um erro.',
  [OAuthError.FAILED]:
    'Não foi possível realizar o login no momento. Tente novamente.',
}
