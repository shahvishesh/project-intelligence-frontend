import { createFileRoute } from '@tanstack/react-router';
import { Box, Typography } from '@mui/material';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Welcome to Project Intelligence.
      </Typography>
    </Box>
  );
}
