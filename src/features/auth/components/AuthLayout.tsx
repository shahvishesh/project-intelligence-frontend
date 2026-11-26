import { Box, Typography } from "@mui/material";

import { AuthBrandPanel } from "./AuthBrandPanel.tsx";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: { xs: 3, sm: 6 },
          py: 6,
        }}
      >
        <Typography
          variant="brand"
          sx={{
            alignSelf: "flex-start",
            fontSize: { xs: "2.25rem", md: "2.75rem" },
            lineHeight: 1,
            color: "brand.logo",
          }}
        >
          Homer
        </Typography>

        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          p: 3,
          boxSizing: "border-box",
        }}
      >
        <AuthBrandPanel />
      </Box>
    </Box>
  );
}
