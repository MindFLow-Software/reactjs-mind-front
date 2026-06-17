import {
  createBrowserRouter,
  Outlet,
  redirect,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { getProfile } from './api/psychologists/get-profile'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { PatientsList } from './pages/app/patients/patients-list/patients-list'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { GoogleOAuthSuccess } from './pages/auth/google-oauth-success'
import { GoogleOAuthComplete } from './pages/auth/google-oauth-complete'
import { ProfilesPage } from './pages/auth/profiles/profiles-page'
import { PatientDashboard } from './pages/app/patient-dashboard/patient-dashboard'
import { AppointmentsRoom } from './pages/app/video-room/appoinmets-room'
import { AppointmentsList } from './pages/app/appointment/appointment-list/appointment-list'
import { MockPsychologistProfilePage } from './pages/app/account/account'
import { LandingPage } from './pages/landing-page/landing-page'
import { DashboardFinance } from './pages/app/finance/dashboard-finance'
import { AvailabilityPage } from './pages/app/appointment/availability-page/availability-page'
import { SuggestionPage } from './pages/app/suggestion/suggestion-page'
import { AdminDashboard } from './pages/app/admin/dashboard/admin-dashboard'
import { AdminSuggestionsPage } from './pages/app/admin/suggestions/suggestions-page'
import { SuggestionsManagement } from './pages/app/admin/suggestions/suggestions-management'
import { PatientDocuments } from './pages/app/patients/patients-docs/patients-docs'
import PatientDetails from './pages/app/patients/patients-hub/patients-details'
import PatientsRecords from './pages/app/patients/patients-records/patients-records'
import { useActivePracticeContextStore } from './store/use-active-practice-context-store'
import { PsychologistOnboardingPage } from './pages/auth/onboarding/psychologist/psychologist-onboarding'
import { PracticeContextPage } from './pages/auth/practice-context/practice-context-page'

const authLoader = async () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (isAuthenticated) return null

  // Sem flag local — pode ser login via Google OAuth (cookie já setado pelo backend)
  try {
    const profile = await getProfile()
    localStorage.setItem('isAuthenticated', 'true')
    if (profile.platformRole === 'ADMIN') return redirect('/admin-dashboard')
    if (profile.platformRole === 'USER') return redirect('/profiles')
    return null
  } catch {
    return redirect('/sign-in')
  }
}

const adminLoader = async () => {
  try {
    const profile = await getProfile()
    if (profile.platformRole !== 'ADMIN') return redirect('/dashboard')
    return null
  } catch {
    return redirect('/sign-in')
  }
}

const practiceContextGuard = () => {
  if (
    useActivePracticeContextStore.getState().activePracticeContextId === null
  ) {
    return redirect('/profiles')
  }
  return null
}

// Patient mode clears the practice context; a non-null context means the user is in psychologist mode
const patientDashboardGuard = () => {
  if (
    useActivePracticeContextStore.getState().activePracticeContextId !== null
  ) {
    return redirect('/profiles')
  }
  return null
}

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    errorElement: <NotFound />,
    children: [{ path: '/', element: <LandingPage /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
      { path: '/auth/google/success', element: <GoogleOAuthSuccess /> },
      { path: '/auth/google/complete', element: <GoogleOAuthComplete /> },
      { path: '/google-oauth-success', element: <GoogleOAuthSuccess /> },
      { path: '/google-oauth-complete', loader: () => redirect('/sign-in') },
    ],
  },
  { path: '/complete-registration', loader: () => redirect('/sign-in') },
  {
    path: '/profiles',
    element: (
      <ProtectedRoute>
        <ProfilesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding/psychologist',
    element: <PsychologistOnboardingPage />,
  },
  {
    path: '/profiles/context',
    element: <PracticeContextPage />,
  },
  {
    path: '/patient-dashboard',
    loader: patientDashboardGuard,
    element: (
      <ProtectedRoute>
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    loader: authLoader,
    children: [
      {
        path: '/dashboard',
        loader: practiceContextGuard,
        element: <Dashboard />,
      },
      { path: '/dashboard-finance', element: <DashboardFinance /> },
      { path: '/patients-list', element: <PatientsList /> },
      { path: '/patients-records', element: <PatientsRecords /> },
      { path: '/patients-docs', element: <PatientDocuments /> },
      { path: '/patients/:id/details', element: <PatientDetails /> },
      { path: '/video-room', element: <AppointmentsRoom /> },
      { path: '/appointment', element: <AppointmentsList /> },
      { path: '/availability', element: <AvailabilityPage /> },
      { path: '/account', element: <MockPsychologistProfilePage /> },
      { path: '/approvals', loader: () => redirect('/admin-dashboard') },
      {
        path: '/admin-dashboard',
        loader: adminLoader,
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin-suggestions',
        loader: adminLoader,
        element: (
          <ProtectedRoute>
            <AdminSuggestionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/menagement-suggestions',
        loader: adminLoader,
        element: (
          <ProtectedRoute>
            <SuggestionsManagement />
          </ProtectedRoute>
        ),
      },

      { path: '/suggestion', element: <SuggestionPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
