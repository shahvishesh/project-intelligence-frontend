import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

import { logout } from "../../features/auth/api/authApi";
import { tokenStorage } from "../../services/auth/tokenStorage";

export function AppNavbar() {
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      tokenStorage.clearAccessToken();

      navigate({
        to: "/auth/login",
      });
    },
  });

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        color: "brand.text",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: 3,
        }}
      >
        <Typography
          variant="brand"
          sx={{
            color: "brand.logo",
            fontSize: "1.8rem",
            lineHeight: 1,
          }}
        >
          Homer
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Button
          color="inherit"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          sx={{
            textTransform: "none",
          }}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
