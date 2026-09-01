import {
  publicApiClient,
} from '../../../services/api/publicApiClient'

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
  const response = await publicApiClient.post<LoginResponse>(
    '/auth/login',
    data,
  )

  return response.data
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  organizationName: string
}

export interface RegisterResponse {
  user: {
    id: number
    name: string
    email: string
  }
  organization: {
    id: number
    name: string
  }
}

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await publicApiClient.post<RegisterResponse>(
    '/auth/register',
    data,
  )

  return response.data
}