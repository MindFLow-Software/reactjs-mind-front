import './global.css'
import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './components/theme/theme-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="MindFlush-theme">
        <Helmet titleTemplate="%s | MindFlush" />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
  
}
