import {
    Alert,
    Box,
    Button,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'

import {
    register as registerUser,
    type RegisterRequest,
} from '../api/authApi'

export function RegisterForm() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterRequest>()

    const registerMutation = useMutation({
        mutationFn: registerUser,

        onSuccess: () => {
            navigate({
                to: '/auth/login',
            })
        },
    })

    const onSubmit = (data: RegisterRequest) => {
        registerMutation.mutate({
            ...data,
            name: data.name.trim(),
            email: data.email.trim(),
            organizationName: data.organizationName.trim(),
        })
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 420 }}>
            <Stack spacing={3}>
                <Stack spacing={1}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 600 }}
                    >
                        Create your account
                    </Typography>

                    <Typography color="text.secondary">
                        Get started with Project Intelligence.
                    </Typography>
                </Stack>

                {registerMutation.isError && (
                    <Alert severity="error">
                        {registerMutation.error.message}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Stack spacing={2.5}>
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
                            label="Email"
                            type="email"
                            fullWidth
                            {...register('email', {
                                required: 'Email is required',
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    'Email is required',
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <TextField
                            label="Organization name"
                            fullWidth
                            {...register('organizationName', {
                                required: 'Organization name is required',
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    'Organization name is required',
                            })}
                            error={!!errors.organizationName}
                            helperText={errors.organizationName?.message}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={registerMutation.isPending}
                            sx={{
                                bgcolor: 'brand.cta',
                                color: 'secondary.contrastText',
                                '&:hover': {
                                    bgcolor: 'brand.ctaHover',
                                },
                            }}
                        >
                            {registerMutation.isPending
                                ? 'Creating account...'
                                : 'Create account'}
                        </Button>
                    </Stack>
                </Box>

                <Button
                    variant="text"
                    sx={{ color: 'text.secondary' }}
                    onClick={() => {
                        navigate({
                            to: '/auth/login',
                        })
                    }}
                >
                    Already have an account?
                    <Box component="span" sx={{ color: 'brand.cta', ml: 0.5 }}>
                        Sign in
                    </Box>
                </Button>
            </Stack>
        </Box>
    )
}