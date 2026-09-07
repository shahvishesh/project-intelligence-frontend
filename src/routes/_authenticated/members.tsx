import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { getInvitations, resendInvitation } from '../../features/members/api/membersApi'
import { InviteMemberDialog } from '../../features/members/components/InviteMemberDialog'
import { toast } from 'react-toastify'
import { getCurrentUser } from '../../features/auth/api/authApi'
import { dataTableActionsCellSx, dataTableActionsStackSx, dataTableContainerSx, dataTableEmptyStateCellSx, dataTableHeadRowSx, dataTablePrimaryCellSx } from '../../components/table/tableStyles'
import { pageHeaderPaperSx, pageHeaderTitleSx, pageContentPaperSx } from '../../components/page/pageStyles'

export const Route = createFileRoute('/_authenticated/members')({
  beforeLoad: async ({ context }) => {
    const currentUser =
      await context.queryClient.query({
        queryKey: ['auth', 'me'],
        queryFn: getCurrentUser,
      })

    const canViewMembers =
      currentUser.systemPermissions.includes(
        'MEMBER_VIEW',
      )

    if (!canViewMembers) {
      throw redirect({
        to: '/forbidden',
      })
    }
  },

  component: MembersPage,
})

function MembersPage() {
  const [inviteDialogOpen, setInviteDialogOpen] =
    useState(false)

  const invitationsQuery = useQuery({
    queryKey: ['invitations'],
    queryFn: getInvitations,
  })

  const resendMutation = useMutation({
    mutationFn: resendInvitation,

    onMutate: (invitationId) => {
      setResendingInvitationId(invitationId)
    },

    onSuccess: (response) => {
      invitationsQuery.refetch()

      toast.success(response.message)
    },

    onError: (error) => {
      toast.error(error.message)
    },

    onSettled: () => {
      setResendingInvitationId(null)
    },
  })

  const [resendingInvitationId, setResendingInvitationId] = useState<number | null>(null)

  return (
    <>
      <Box>
        <Paper
          variant="outlined"
          sx={pageHeaderPaperSx}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'flex-start' },
            }}
          >
            <Stack spacing={0.25}>
              <Typography
                variant="h5"
                sx={pageHeaderTitleSx}
              >
                Members
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Manage the members of your organization.
              </Typography>
            </Stack>

            <Button
              variant="contained"
              onClick={() => setInviteDialogOpen(true)}
            >
              Invite member
            </Button>
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={
            pageContentPaperSx
          }
        >
          {invitationsQuery.isLoading && (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">
                Loading invitations...
              </Typography>
            </Box>
          )}

          {invitationsQuery.isError && (
            <Box sx={{ p: 3 }}>
              <Typography color="error">
                {invitationsQuery.error.message}
              </Typography>
            </Box>
          )}

          <TableContainer
            component={Box}
            sx={dataTableContainerSx}
          >
            <Table>
              <TableHead>
                <TableRow sx={dataTableHeadRowSx}>
                  <TableCell>Email</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Invited by</TableCell>
                  <TableCell>Invited</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell sx={dataTableActionsCellSx}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {invitationsQuery.data?.map(
                  (invitation) => (
                    <TableRow
                      key={invitation.id}
                      hover
                    >
                      <TableCell
                        sx={dataTablePrimaryCellSx}
                      >
                        {invitation.email}
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            flexWrap: 'wrap',
                            gap: 0.5,
                          }}
                        >
                          {invitation.roles.map(
                            (role) => (
                              <Chip
                                key={role.id}
                                label={role.name}
                                size="small"
                              />
                            ),
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={invitation.status}
                          size="small"
                          color={
                            invitation.status ===
                              'PENDING'
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {invitation.invitedBy.name}
                      </TableCell>

                      <TableCell>
                        {new Date(
                          invitation.createdAt,
                        ).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        {new Date(
                          invitation.expiresAt,
                        ).toLocaleDateString()}
                      </TableCell>

                      <TableCell
                        sx={dataTableActionsCellSx}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={dataTableActionsStackSx}
                        >
                          {invitation.status ===
                            'PENDING' && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  resendMutation.mutate(
                                    invitation.id,
                                  )
                                }
                                disabled={
                                  resendingInvitationId ===
                                  invitation.id
                                }
                              >
                                {resendingInvitationId ===
                                  invitation.id
                                  ? 'Resending...'
                                  : 'Resend'}
                              </Button>
                            )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ),
                )}

                {invitationsQuery.data?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={dataTableEmptyStateCellSx}
                    >
                      No invitations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <InviteMemberDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
      />
    </>
  )
}