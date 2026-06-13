import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthLeftPanel } from '@/pages/auth/components/auth-left-panel'

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
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[45%_55%]">
      <AuthLeftPanel />

      <div className="flex flex-col items-center justify-center overflow-y-auto bg-gray-50 px-6 py-10">
        <Outlet />
      </div>
    </div>
  )
}
