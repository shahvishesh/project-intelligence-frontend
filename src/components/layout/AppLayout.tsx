import { Box } from '@mui/material';

import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppNavbar />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <AppSidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            bgcolor: '#f7f8fa',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
