import { Box, Stack, Typography } from '@mui/material'

export function LoginBrandPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        px: 6,
      }}
    >
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600 }}
        >
          Project Intelligence
        </Typography>

        <Typography
          variant="h6"
          sx={{ fontWeight: 400 }}
        >
          Manage your projects with clarity.
        </Typography>

        <Typography
          variant="body1"
          sx={{ opacity: 0.85 }}
        >
          Keep your projects, teams, and work organized in
          one place.
        </Typography>
      </Stack>
    </Box>
  )
}