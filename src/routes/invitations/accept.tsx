import { useMutation, useQuery } from '@tanstack/react-query'
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import {
    createFileRoute,
    useNavigate,
} from '@tanstack/react-router'
import {
    useForm,
} from 'react-hook-form'
import { toast } from 'react-toastify'

import { AuthLayout } from '../../features/auth/components/AuthLayout'
import {
    acceptInvitation,
    validateInvitation,
} from '../../features/auth/api/authApi'

interface AcceptInvitationForm {
    name: string
    password: string
    confirmPassword: string
}

export const Route = createFileRoute(
    '/invitations/accept',
)({
    validateSearch: (search) => ({
        token:
            typeof search.token === 'string'
                ? search.token
                : '',
    }),

    component: AcceptInvitationPage,
})

function AcceptInvitationPage() {
    const { token } = Route.useSearch()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<AcceptInvitationForm>({
        defaultValues: {
            name: '',
            password: '',
            confirmPassword: '',
        },
    })

    const invitationQuery = useQuery({
        queryKey: ['invitation', 'validate', token],
        queryFn: () => validateInvitation(token),
        enabled: Boolean(token),
    })

    const acceptInvitationMutation = useMutation({
        mutationFn: acceptInvitation,

        onSuccess: (response) => {
            toast.success(response.message)

            navigate({
                to: '/auth/login',
            })
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (
        data: AcceptInvitationForm,
    ) => {
        acceptInvitationMutation.mutate({
            token,
            name: data.name.trim(),
            password: data.password,
        })
    }

    // No token in the URL
    if (!token) {
        return (
            <InvitationMessage
                title="Invalid invitation"
                message="This invitation link is missing a valid invitation token."
            />
        )
    }

    // Waiting for invitation validation
    if (invitationQuery.isPending) {
        return (
            <AuthLayout>
                <CircularProgress />
            </AuthLayout>
        )
    }

    // Invitation validation failed
    if (invitationQuery.isError) {
        const errorMessage =
            invitationQuery.error.message

        if (
            errorMessage ===
            'Invitation is no longer valid'
        ) {
            return (
                <InvitationMessage
                    title="Invitation already used"
                    message="This invitation has already been accepted and can no longer be used."
                />
            )
        }

        if (
            errorMessage ===
            'Invitation has expired'
        ) {
            return (
                <InvitationMessage
                    title="Invitation expired"
                    message="This invitation has expired. Please ask the organization administrator to send you a new invitation."
                />
            )
        }

        return (
            <InvitationMessage
                title="Invalid invitation"
                message="This invitation link is invalid or no longer available."
            />
        )
    }


    const invitation = invitationQuery.data

    return (
        <AuthLayout>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 600 }}
                            gutterBottom
                        >
                            Accept invitation
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            You've been invited to join{' '}
                            <strong>
                                {invitation.data.organization.name}
                            </strong>
                            .
                        </Typography>
                    </Box>

                    <Stack
                        component="form"
                        spacing={2}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <TextField
                            label="Email"
                            value={invitation.data.email}
                            fullWidth
                            disabled
                        />

                        <TextField
                            label="Name"
                            fullWidth
                            {...register('name', {
                                required: 'Name is required',
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    'Name is required',
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />

                        <TextField
                            type="password"
                            label="Password"
                            fullWidth
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Password must be at least 6 characters',
                                },
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <TextField
                            type="password"
                            label="Confirm password"
                            fullWidth
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === getValues('password') ||
                                    'Passwords do not match',
                            })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={
                                acceptInvitationMutation.isPending
                            }
                            sx={{
                                bgcolor: 'brand.cta',
                                color: 'secondary.contrastText',
                                '&:hover': {
                                    bgcolor: 'brand.ctaHover',
                                },
                            }}
                        >
                            {acceptInvitationMutation.isPending
                                ? 'Accepting...'
                                : 'Accept invitation'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </AuthLayout>
    )
}

interface InvitationMessageProps {
    title: string
    message: string
}

function InvitationMessage({
    title,
    message,
}: InvitationMessageProps) {
    const navigate = useNavigate()

    return (
        <AuthLayout>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 600 }}
                            gutterBottom
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {message}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() =>
                            navigate({
                                to: '/auth/login',
                            })
                        }
                    >
                        Go to login
                    </Button>
                </Stack>
            </Box>
        </AuthLayout>
    )
}