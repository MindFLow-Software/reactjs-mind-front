import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

import { BrandedLoader } from '@/components/branded-loader/branded-loader'

import './google-oauth-success-page.css'

export function GoogleOAuthSuccessPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/dashboard', { replace: true })
  }, [navigate])

  return (
    <>
      <Helmet title="Finalizando login | MindFlush" />

      <div className="gos-shell">
        <BrandedLoader message="Finalizando login..." />
      </div>
    </>
  )
}
