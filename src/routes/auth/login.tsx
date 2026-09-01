import { Box } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

import { LoginForm } from '../../features/auth/components/LoginForm'
import { LoginBrandPanel } from '../../features/auth/components/LoginBrandPanel'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      {/* Branding panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
        }}
      >
        <LoginBrandPanel />
      </Box>

      {/* Login panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 6 },
          py: 6,
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  )
}