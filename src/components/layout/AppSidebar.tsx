import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";

import { logout } from "../../features/auth/api/authApi";
import { useAuthorization } from "../../features/auth/hooks/useAuthorization";
import { tokenStorage } from "../../services/auth/tokenStorage";

const navigationItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    label: "Members",
    to: "/members",
    permission: "MEMBER_VIEW",
  },
  {
    label: "Projects",
    to: "/projects",
  },
] as const;

export function AppSidebar() {
  const matchRoute = useMatchRoute();
  const { can } = useAuthorization();
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

  const itemSx = {
    mx: 1,
    my: 0.5,
    borderRadius: 1,
    px: 2,
    py: 1,
    minHeight: 44,
    justifyContent: "flex-start",

    border: 1,
    borderColor: "transparent",

    color: "brand.text",

    "& .MuiListItemText-primary": {
      typography: "body2",
    },

    "&:hover": {
      bgcolor: "action.hover",
      color: "brand.text",
    },

    "&.Mui-selected": {
      bgcolor: "surface.content",
      // borderColor: "#c9cbc2",
      color: "brand.text",
      //boxShadow: "0 2px 8px rgba(19, 19, 19, 0.08)",

      "&:hover": {
        bgcolor: "surface.content",
      },
    },

    "&.Mui-selected .MuiListItemText-primary": {
      typography: "body1",
      fontWeight: 700,
    },
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        flexShrink: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Typography
        variant="brand"
        sx={{
          px: 3,
          py: 2.5,
          color: "brand.logo",
          fontSize: "2rem",
          lineHeight: 1,
        }}
      >
        Homer
      </Typography>

      <List sx={{ py: 1 }}>
        {navigationItems.map((item) => {
          if ("permission" in item && !can(item.permission)) {
            return null;
          }

          const isActive = Boolean(
            matchRoute({
              to: item.to,
              fuzzy: true,
            }),
          );

          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={isActive}
              sx={itemSx}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Button
          fullWidth
          color="inherit"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          sx={{
            justifyContent: "flex-start",
            px: 2,
            color: "brand.text",
          }}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </Box>
    </Box>
  );
}
