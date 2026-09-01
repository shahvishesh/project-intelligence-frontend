import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './router.tsx'
import { RouterProvider } from '@tanstack/react-router'
import { AppProviders } from './app/providers.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
