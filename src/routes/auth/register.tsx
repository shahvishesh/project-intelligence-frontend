import { createFileRoute } from '@tanstack/react-router';

import { AuthLayout } from '../../features/auth/components/AuthLayout';
import { RegisterForm } from '../../features/auth/components/RegisterForm';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
