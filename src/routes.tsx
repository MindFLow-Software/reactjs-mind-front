import { createBrowserRouter, Outlet, redirect } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/auth/layout'
import { PatientsList } from './pages/app/patients/patients-list/patients-list'
import { PsychologistDashboard } from './pages/app/psychologist/dashboard/psychologist-dashboard'
import { DashboardRedirect } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { SignInPage } from './pages/auth/sign-in/sign-in-page'
import { SignUpPage } from './pages/auth/sign-up/sign-up-page'
import { GoogleOAuthSuccessPage } from './pages/auth/google-oauth-success/google-oauth-success-page'
import { ProfilesPage } from './pages/app/profiles/profiles-page'
import { PatientDashboard } from './pages/app/patient/dashboard/patient-dashboard'
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
import PatientFollowUp from './pages/app/patient-follow-up/patient-follow-up'
import PatientsRecords from './pages/app/patients/patients-records/patients-records'

import { PracticeContextPage } from './pages/app/practice-context/practice-context-page'
import { PsychologistOnboardingPage } from './pages/app/onboarding/psychologist/psychologist-onboarding'
import { useActivePracticeContextStore } from './store/use-active-practice-context-store'

import { AdminRoute } from './components/auth/admin-route'
import { ProtectedRoute } from './components/auth/protected-route'
import { ValidatePatientInvitePage } from './pages/auth/invite/validate-patient-invite/validate-patient-invite-page'
import { RegisterViaPatientInvitePage } from './pages/auth/invite/register-via-patient-invite/register-via-patient-invite-page'
import { PatientInviteReviewPage } from './pages/auth/invite/patient-invite-review/patient-invite-review-page'
import { ContextSelectionPage } from './pages/app/profiles/context-selection-page'
import { ClaimCandidatesPage } from './pages/app/claim-candidates/claim-candidates-page'
import { ClaimProfileRequestsPage } from './pages/app/claim-profile-requests/claim-profile-requests-page'
import { PatientOnboardingPage } from './pages/app/onboarding/patient/patient-onboarding'
import { Loader2 } from 'lucide-react'
import { RegisterPatientViaRegistrationLinkPage } from './pages/auth/registration-link/register-patient-via-registration-link/register-patient-via-registration-link-page'

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
      { path: '/sign-in', element: <SignInPage /> },
      { path: '/sign-up', element: <SignUpPage /> },
      // TODO: ajustar dois paths diferentes levam para mesma página
      { path: '/auth/google/success', element: <GoogleOAuthSuccessPage /> },
      { path: '/google-oauth-success', element: <GoogleOAuthSuccessPage /> },
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
        path: '/patient/register/:hash',
        element: <RegisterPatientViaRegistrationLinkPage />,
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
        element: <DashboardRedirect />,
      },
      {
        path: '/psychologist/dashboard',
        loader: practiceContextGuard,
        element: <PsychologistDashboard />,
      },
      {
        path: '/admin/dashboard',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: '/patient/dashboard',
        loader: patientDashboardGuard,
        element: <PatientDashboard />,
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
        path: '/patient/:patientId/follow-up',
        loader: practiceContextGuard,
        element: <PatientFollowUp />,
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
      { path: '/approvals', loader: () => redirect('/admin/dashboard') },
      {
        path: '/admin-dashboard',
        loader: () => redirect('/admin/dashboard'),
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
        path: '/patient-dashboard',
        loader: () => redirect('/patient/dashboard'),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
