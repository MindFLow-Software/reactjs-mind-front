import { createBrowserRouter, Outlet } from 'react-router-dom' // Importe o Outlet

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { PatientsList } from './pages/app/patients/patients-list'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { NotFound } from './pages/404'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { AppointmentsRoom } from './pages/app/video-room/appoinmets-room'
import { AppointmentsList } from './pages/app/appointment/appointment-list'
import { MockPsychologistProfilePage } from './pages/app/account/account'
// import { DashboardFinance } from './pages/app/finance/dashboard-finance'
import { LandingPage } from './pages/landing-page/landing-page'

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
  // GRUPO 1: Landing Page (Com Header)
  {
    path: '/',
    element: <LandingLayout />, // Usa o layout com Header
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
    ],
  },

  // GRUPO 2: Autenticação (Sem Header da Landing, usa layout de Auth)
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },

  // GRUPO 3: Aplicação Logada (Dashboard, etc)
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      // {
      //   path: '/dashboard-finance',
      //   element: <DashboardFinance />,
      // },
      {
        path: '/patients-list',
        element: <PatientsList />,
      },
      {
        path: '/video-room',
        element: <AppointmentsRoom />,
      },
      {
        path: '/appointment',
        element: <AppointmentsList />,
      },
      {
        path: '/account',
        element: <MockPsychologistProfilePage />,
      },
      {
        path: '/perfil',
        element: <MockPsychologistProfilePage />,
      },
    ],
  },
])