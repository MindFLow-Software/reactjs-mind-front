import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { OAUTH_ERROR_PARAM } from '../constants'
import { resolveOAuthErrorMessage } from '../helpers'

export function useOAuthErrorToast() {
  const [searchParams, setSearchParams] = useSearchParams()
  const notifiedError = useRef<string | null>(null)

  const oauthError = searchParams.get(OAUTH_ERROR_PARAM)

  useEffect(() => {
    if (!oauthError) {
      notifiedError.current = null
      return
    }

    // StrictMode runs the effect twice on mount; the ref keeps the toast single
    if (notifiedError.current === oauthError) return
    notifiedError.current = oauthError

    const message = resolveOAuthErrorMessage(oauthError)
    if (message) toast.error(message)

    const params = new URLSearchParams(searchParams)
    params.delete(OAUTH_ERROR_PARAM)
    setSearchParams(params, { replace: true })
  }, [oauthError, searchParams, setSearchParams])
}
