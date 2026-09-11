import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "./queryClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
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
  );
}
