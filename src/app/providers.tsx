import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { appTheme } from "./theme";
import { queryClient } from "./queryClient";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          {children}

          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            theme="colored"
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
