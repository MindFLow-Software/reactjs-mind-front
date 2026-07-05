import { createBrowserRouter, Outlet, redirect } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { PatientsList } from './pages/app/patients/patients-list/patients-list'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { GoogleOAuthSuccess } from './pages/auth/google-oauth-success'
import { ProfilesPage } from './pages/app/profiles/profiles-page'
import { PatientDashboard } from './pages/app/patient-dashboard/patient-dashboard'
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

import { ClaimAccountPage } from './pages/auth/claim-account'
import { PracticeContextPage } from './pages/app/practice-context/practice-context-page'
import { PsychologistOnboardingPage } from './pages/app/onboarding/psychologist/psychologist-onboarding'
import { useActivePracticeContextStore } from './store/use-active-practice-context-store'

import { AdminRoute } from './components/auth/admin-route'
import { ProtectedRoute } from './components/auth/protected-route'
import { ValidatePatientInvitePage } from './pages/auth/invite/validate-patient-invite-page'
import { RegisterViaPatientInvitePage } from './pages/auth/invite/register-via-patient-invite-page'
import { PatientInviteReviewPage } from './pages/auth/invite/patient-invite-review-page'
import { ContextSelectionPage } from './pages/app/profiles/context-selection-page'
import { ClaimCandidatesPage } from './pages/app/claim-candidates/claim-candidates-page'
import { ClaimProfileRequestsPage } from './pages/app/claim-profile-requests/claim-profile-requests-page'
import { PatientOnboardingPage } from './pages/app/onboarding/patient/patient-onboarding'
import { Loader2 } from 'lucide-react'

const AppointmentsRoom = lazy(() =>
  import('./pages/app/video-room/appoinmets-room').then((module) => ({
    default: module.AppointmentsRoom,
  })),
)

function RouteFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
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
      {
        path: '/auth/google/complete',
        loader: () => redirect('/auth/google/success'),
      },
      { path: '/google-oauth-success', element: <GoogleOAuthSuccess /> },
      { path: '/claim-account', element: <ClaimAccountPage /> },
      {
        path: '/patient/invite/:token',
        element: <ValidatePatientInvitePage />,
      },
      {
        path: '/patient/invite/:token/register',
        element: <RegisterViaPatientInvitePage />,
      },
      {
        path: '/patient/invite/:token/review',
        element: <PatientInviteReviewPage />,
      },
      {
        path: '/google-oauth-complete',
        loader: () => redirect('/auth/google/success'),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/profiles',
        element: <ProfilesPage />,
      },
      {
        path: '/onboarding/psychologist',
        element: <PsychologistOnboardingPage />,
      },
      {
        path: '/onboarding/patient',
        element: <PatientOnboardingPage />,
      },
      {
        path: '/profiles/context',
        element: <PracticeContextPage />,
      },
      {
        path: '/profiles/contexts',
        element: <ContextSelectionPage />,
      },
      {
        path: '/profiles/claim-candidates',
        element: <ClaimCandidatesPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        loader: practiceContextGuard,
        element: <Dashboard />,
      },
      {
        path: '/dashboard-finance',
        loader: practiceContextGuard,
        element: <DashboardFinance />,
      },
      {
        path: '/patients-list',
        loader: practiceContextGuard,
        element: <PatientsList />,
      },
      {
        path: '/patients-records',
        loader: practiceContextGuard,
        element: <PatientsRecords />,
      },
      {
        path: '/patients-docs',
        loader: practiceContextGuard,
        element: <PatientDocuments />,
      },
      {
        path: '/patients/:id/details',
        loader: practiceContextGuard,
        element: <PatientDetails />,
      },
      {
        path: '/video-room',
        loader: practiceContextGuard,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <AppointmentsRoom />
          </Suspense>
        ),
      },
      {
        path: '/appointment',
        loader: practiceContextGuard,
        element: <AppointmentsList />,
      },
      {
        path: '/availability',
        loader: practiceContextGuard,
        element: <AvailabilityPage />,
      },
      { path: '/account', element: <MockPsychologistProfilePage /> },
      { path: '/approvals', loader: () => redirect('/admin-dashboard') },
      {
        path: '/admin-dashboard',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: '/admin-suggestions',
        element: (
          <AdminRoute>
            <AdminSuggestionsPage />
          </AdminRoute>
        ),
      },
      {
        path: '/management-suggestions',
        element: (
          <AdminRoute>
            <SuggestionsManagement />
          </AdminRoute>
        ),
      },

      { path: '/suggestion', element: <SuggestionPage /> },

      {
        path: '/patient-profiles/claim-requests',
        loader: practiceContextGuard,
        element: <ClaimProfileRequestsPage />,
      },

      {
        // TODO: patient-dashboard is going to be same /dashboard route,
        // and a switch case inside the page to render the correct component
        path: '/patient-dashboard',
        loader: patientDashboardGuard,
        element: <PatientDashboard />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
