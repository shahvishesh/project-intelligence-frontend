import { refreshClient } from '../../../services/api/refreshClient'

export type RefreshResponse = {
  message: string
  data: {
    accessToken: string
  }
}

export async function refreshAccessToken(): Promise<string> {
  const response = await refreshClient.post<RefreshResponse>(
    '/auth/refresh',
  )

  return response.data.data.accessToken
}