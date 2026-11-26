import type { CSSProperties } from "react";
import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

interface BrandPalette {
  cta: string;
  ctaHover: string;
  ink: string;
  logo: string;
  panel: string;
  text: string;
}

interface SurfacePalette {
  border: string;
  content: string;
}

interface StatusPalette {
  active: string;
  activeText: string;
  accepted: string;
  acceptedText: string;
  pending: string;
  pendingText: string;
  planned: string;
  plannedText: string;
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    brand: CSSProperties;
  }

  interface TypographyVariantsOptions {
    brand?: CSSProperties;
  }

  interface Palette {
    brand: BrandPalette;
    surface: SurfacePalette;
    status: StatusPalette;
  }

  interface PaletteOptions {
    brand?: BrandPalette;
    surface?: SurfacePalette;
    status?: StatusPalette;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    brand: true;
  }
}

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f766e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#e9e5d8",
      paper: "#ffffff",
    },
    surface: {
      border: "#deded9",
      content: "#f9f4ee",
    },
    status: {
      active: "#DCEEDB",
      activeText: "#2F6B38",
      accepted: "#DCEEDB",
      acceptedText: "#2F6B38",
      pending: "#F7E8B8",
      pendingText: "#765A16",
      planned: "#D9EEF2",
      plannedText: "#0E6570",
    },
    brand: {
      cta: "#e16328",
      ctaHover: "#D95F23",
      ink: "#131313",
      logo: "#1f1f1f",
      panel: "#f9f4ee",
      text: "#131313",
    },
    text: {
      primary: "#172033",
      secondary: "#667085",
    },
    divider: "#e4e7ec",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter Tight", sans-serif',
    h1: {
      fontFamily: '"Bricolage Grotesque", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Bricolage Grotesque", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: '"Bricolage Grotesque", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    h4: {
      fontFamily: '"Bricolage Grotesque", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    h5: {
      fontFamily: '"Bricolage Grotesque", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontFamily: '"Bricolage Grotesque", sans-serif',
      fontWeight: 700,
    },
    brand: {
      fontFamily: '"Young Serif", serif',
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#fffef1",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e16328",
          },
          "& .MuiOutlinedInput-input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #fffef1 inset",
            WebkitTextFillColor: "#131313",
            caretColor: "#131313",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#e16328",
          },
        },
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#e16328",
          },
        },
      },
    },
  },
});
