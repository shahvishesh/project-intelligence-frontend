import { apiClient } from '../../../services/api/apiClient'
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

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export interface CurrentUserRole {
  id: number
  name: string
}

export interface CurrentUserOrganization {
  id: number
  name: string
}

export interface CurrentUser {
  id: number
  name: string
  email: string
  organization: CurrentUserOrganization
  systemRoles: CurrentUserRole[]
  systemPermissions: string[]
}

export interface CurrentUserResponse {
  message: string
  data: CurrentUser
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response =
    await apiClient.get<CurrentUserResponse>(
      '/auth/me',
    )

  return response.data.data
}

export interface AcceptInvitationRequest {
  token: string
  name: string
  password: string
}

export interface AcceptInvitationResponse {
  message: string
}

export async function acceptInvitation(
  data: AcceptInvitationRequest,
): Promise<AcceptInvitationResponse> {
  const response =
    await apiClient.post<AcceptInvitationResponse>(
      '/invitations/accept',
      data,
    )

  return response.data
}

export interface ValidateInvitationResponse {
  message: string;
  data: {
    email: string;
    organization: {
      id: number;
      name: string;
    };
  };
}

export async function validateInvitation(
  token: string,
): Promise<ValidateInvitationResponse> {
  const response =
    await apiClient.get<ValidateInvitationResponse>(
      '/invitations/validate',
      {
        params: {
          token,
        },
      },
    );

  return response.data;
}