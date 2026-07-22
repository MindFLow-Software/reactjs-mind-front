import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { oauthAuthenticate } from '@/api/auth/oauth-authenticate'
import { OAuthProvider } from '@/types/auth/oauth-provider'

import { GoogleIcon } from './components/google-icon/google-icon'

import './google-auth-button.css'

export function GoogleAuthButton() {
  const handleAuthenticateWithGoogle = useCallback(() => {
    oauthAuthenticate(OAuthProvider.GOOGLE)
  }, [])

  return (
    <Button
      type="button"
      variant="outline"
      className="gab-root"
      onClick={handleAuthenticateWithGoogle}
    >
      <GoogleIcon />
      Continuar com Google
    </Button>
  )
}
