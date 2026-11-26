import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

import {
    getSystemRoles,
    inviteMember,
} from '../api/membersApi'
import { queryClient } from '../../../app/queryClient'
import { toast } from 'react-toastify'
import { dialogContentSx, dialogHeaderSx, dialogTitleSx } from '../../../components/page/pageStyles'
import { autocompleteOptionCheckboxSx } from '../../../components/form/autocompleteStyles'
import { formatRoleLabel } from '../roleUtils'

interface InviteMemberDialogProps {
    open: boolean
    onClose: () => void
}

interface InviteMemberFormValues {
    email: string
    roles: string[]
}

export function InviteMemberDialog({
    open,
    onClose,
}: InviteMemberDialogProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InviteMemberFormValues>({
        defaultValues: {
            email: '',
            roles: [],
        },
    })

    const rolesQuery = useQuery({
        queryKey: ['system-roles'],
        queryFn: getSystemRoles,
        enabled: open,
    })

    const inviteMutation = useMutation({
        mutationFn: inviteMember,

        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ['invitations'],
            })

            toast.success(response.message)

            reset()
            onClose()
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: InviteMemberFormValues) => {
        inviteMutation.mutate(data)
    }

    const handleClose = () => {
        if (inviteMutation.isPending) {
            return
        }

        reset()
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: 'surface.content',
                },
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'surface.content',
                },
            }}
        >
            <DialogTitle sx={dialogHeaderSx}>
                <Stack spacing={0.25}>
                    <Typography
                        variant="h5"
                        sx={dialogTitleSx}
                    >
                        Invite member
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Invite a user to join your organization.
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent sx={dialogContentSx}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <Controller
                        name="roles"
                        control={control}
                        rules={{
                            validate: (value) =>
                                value.length > 0 ||
                                'Select at least one role',
                        }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                error={!!errors.roles}
                            >
                                <InputLabel>Roles</InputLabel>

                                <Select
                                    {...field}
                                    multiple
                                    label="Roles"
                                    value={field.value}
                                    MenuProps={{
                                        slotProps: {
                                            paper: {
                                                sx: {
                                                    mt: 1,
                                                    bgcolor: 'surface.content',
                                                    border: '1px solid',
                                                    borderColor: 'surface.border',
                                                    borderRadius: 2,
                                                    boxShadow:
                                                        '0 8px 24px rgba(19, 19, 19, 0.12)',
                                                },
                                            },
                                            list: {
                                                sx: {
                                                    p: 1,
                                                    '& .MuiMenuItem-root': {
                                                        mx: 0.5,
                                                        my: 0.5,
                                                        borderRadius: 1,
                                                        '&:hover, &.Mui-selected, &.Mui-selected:hover, &.Mui-focusVisible': {
                                                            bgcolor: 'rgba(225, 99, 40, 0.12)',
                                                            color: 'brand.cta',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                    renderValue={(selected) =>
                                        selected
                                            .map(formatRoleLabel)
                                            .join(', ')
                                    }
                                >
                                    {rolesQuery.data?.map((role) => (
                                        <MenuItem
                                            key={role.id}
                                            value={role.name}
                                        >
                                            <Checkbox
                                                checked={field.value.includes(
                                                    role.name,
                                                )}
                                                sx={autocompleteOptionCheckboxSx}
                                            />

                                            <ListItemText
                                                primary={formatRoleLabel(
                                                    role.name,
                                                )}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>

                                <FormHelperText>
                                    {errors.roles?.message}
                                </FormHelperText>
                            </FormControl>
                        )}
                    />

                    {inviteMutation.isError && (
                        <FormHelperText error>
                            {inviteMutation.error.message}
                        </FormHelperText>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="text"
                    sx={{ color: 'brand.cta' }}
                    onClick={handleClose}
                    disabled={inviteMutation.isPending}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={
                        inviteMutation.isPending ||
                        rolesQuery.isLoading
                    }
                    sx={{
                        bgcolor: 'brand.cta',
                        color: 'secondary.contrastText',
                        '&:hover': {
                            bgcolor: 'brand.ctaHover',
                        },
                    }}
                >
                    {inviteMutation.isPending
                        ? 'Sending...'
                        : 'Send invite'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}