import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';

import { logout } from '../../features/auth/api/authApi';
import { tokenStorage } from '../../services/auth/tokenStorage';

export function AppNavbar() {
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      tokenStorage.clearAccessToken();

      navigate({
        to: '/auth/login',
      });
    },
  });

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          Project Intelligence
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Button
          color="inherit"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          sx={{
            textTransform: 'none',
          }}
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
