import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { tokenStorage } from '../services/auth/tokenStorage';
import { AppLayout } from '../components/layout/AppLayout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const accessToken = tokenStorage.getAccessToken();

    if (!accessToken) {
      throw redirect({
        to: '/auth/login',
      });
    }
  },

  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
