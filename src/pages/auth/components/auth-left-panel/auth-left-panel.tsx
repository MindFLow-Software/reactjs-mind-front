import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import { Brain } from 'lucide-react'

import { Time } from '@/utils/time'

import { SignInHighlights } from './components/sign-in-highlights/sign-in-highlights'
import { SignUpHighlights } from './components/sign-up-highlights/sign-up-highlights'

import './auth-left-panel.css'

export const AuthLeftPanel = memo(function AuthLeftPanel() {
  const { pathname } = useLocation()
  const isSignUp = pathname.startsWith('/sign-up')

  return (
    <div aria-hidden="true" className="alp-root">
      <div className="alp-brand">
        <Brain className="alp-brand-icon" />
        <span className="alp-brand-name">MindFlush</span>
      </div>

      {isSignUp ? <SignUpHighlights /> : <SignInHighlights />}

      <footer className="alp-footer">
        Painel central &copy; MindFlush {Time.currentYear()}
      </footer>
    </div>
  )
})
