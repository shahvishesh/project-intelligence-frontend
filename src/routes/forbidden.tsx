import { createFileRoute, Link } from '@tanstack/react-router'
import { Box, Button, Typography } from '@mui/material'

export const Route = createFileRoute('/forbidden')({
    component: ForbiddenPage,
})

function ForbiddenPage() {
    return (
        <Box
            sx={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                textAlign: 'center',
            }}
        >
            <Typography variant="h5">
                Access denied
            </Typography>

            <Typography color="text.secondary">
                You don't have permission to access this page.
            </Typography>

            <Button
                component={Link}
                to="/dashboard"
                variant="contained"
            >
                Go to dashboard
            </Button>
        </Box>
    )
}