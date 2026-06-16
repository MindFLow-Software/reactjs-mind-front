import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  // TODO: Implement useAuth hook to validate authenticated users
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }

  return <Outlet />
}
