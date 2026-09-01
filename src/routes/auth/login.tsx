import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '../../features/auth/components/AuthLayout'
import { LoginForm } from '../../features/auth/components/LoginForm'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}