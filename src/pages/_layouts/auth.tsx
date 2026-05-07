import { Outlet } from 'react-router-dom'
import { AuthLeftPanel } from '@/pages/auth/components/auth-left-panel'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[45%_55%]">
      <AuthLeftPanel />

      <div className="flex flex-col items-center justify-center overflow-y-auto bg-gray-50 px-6 py-10">
        <Outlet />
      </div>
    </div>
  )
}
