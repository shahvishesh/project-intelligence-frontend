import { createFileRoute, redirect } from '@tanstack/react-router'

import { tokenStorage } from '../services/auth/tokenStorage'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const accessToken = tokenStorage.getAccessToken()

    if (!accessToken) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
})