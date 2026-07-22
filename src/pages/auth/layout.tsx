import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { AuthLeftPanel } from './components/auth-left-panel/auth-left-panel'

import './layout.css'

export function AuthLayout() {
  useLayoutEffect(() => {
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    root.classList.remove('dark')
    return () => {
      if (wasDark) root.classList.add('dark')
    }
  }, [])

  return (
    <div className="auth-layout">
      <AuthLeftPanel />

      <div className="auth-layout__content">
        <Outlet />
      </div>
    </div>
  )
}
