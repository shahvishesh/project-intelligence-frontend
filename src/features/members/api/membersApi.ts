import { apiClient } from '../../../services/api/apiClient'

export interface SystemRole {
    id: number
    name: string
}

export interface SystemRolesResponse {
    message: string
    data: SystemRole[]
}

export interface InviteMemberRequest {
    email: string
    roles: string[]
}

export interface InviteMemberResponse {
    message: string
}

export async function getSystemRoles(): Promise<SystemRole[]> {
    const response =
        await apiClient.get<SystemRolesResponse>(
            '/system-roles',
        )

    return response.data.data
}

export async function inviteMember(
    data: InviteMemberRequest,
): Promise<InviteMemberResponse> {
    const response =
        await apiClient.post<InviteMemberResponse>(
            '/invite',
            data,
        )

    return response.data
}

export interface InvitationRole {
    id: number
    name: string
}

export interface InvitedBy {
    id: number
    name: string
    email: string
}

export interface OrganizationInvitation {
    id: number
    email: string
    status: string
    expiresAt: string
    createdAt: string
    roles: InvitationRole[]
    invitedBy: InvitedBy
}

export interface InvitationsResponse {
    message: string
    data: OrganizationInvitation[]
}

export async function getInvitations(): Promise<
    OrganizationInvitation[]
> {
    const response =
        await apiClient.get<InvitationsResponse>(
            '/invitations',
        )

    return response.data.data
}

export async function resendInvitation(
    invitationId: number,
): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
        `/invitations/${invitationId}/resend`,
    )

    return response.data
}