import { apiClient } from '../../../services/api/apiClient'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginUser = {
  id: number
  name: string
  email: string
  organizationId: number
}

export type LoginResponse = {
  message: string
  data: {
    accessToken: string
    user: LoginUser
  }
}

export async function login(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    data,
  )

  return response.data
}