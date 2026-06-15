import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function GoogleOAuthComplete() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/sign-in', { replace: true })
  }, [navigate])

  return null
}
