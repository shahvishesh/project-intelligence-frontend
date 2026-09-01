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

import { login, type LoginRequest } from '../api/authApi'
import { tokenStorage } from '../../../services/auth/tokenStorage'
import { useNavigate } from '@tanstack/react-router'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      tokenStorage.setAccessToken(response.data.accessToken)

      navigate({
        to: '/dashboard',
      })
    },
  })

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 420 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600 }}
          >
            Welcome back
          </Typography>

          <Typography color="text.secondary">
            Sign in to your account to continue.
          </Typography>
        </Stack>

        {loginMutation.isError && (
          <Alert severity="error">
            Unable to sign in. Please check your credentials.
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register('email', {
                required: 'Email is required',
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
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? 'Signing in...'
                : 'Sign in'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}