import { Box } from "@mui/material";

import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      <AppSidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          bgcolor: "surface.content",
          mt: 2,
          mr: 2,
          // border: "1px solid",
          // borderColor: "surface.border",
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
