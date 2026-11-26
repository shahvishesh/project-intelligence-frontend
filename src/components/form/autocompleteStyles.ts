import type { PopperProps } from "@mui/material/Popper";
import type { SxProps, Theme } from "@mui/material/styles";

export const autocompletePopperProps: Partial<PopperProps> = {
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 8],
      },
    },
  ],
};

export const autocompletePopupPaperSx: SxProps<Theme> = {
  bgcolor: "surface.content",
  border: "1px solid",
  borderColor: "surface.border",
  borderRadius: 2,
  boxShadow: "0 8px 24px rgba(19, 19, 19, 0.12)",
};

export const autocompletePopupListboxSx: SxProps<Theme> = {
  p: 1,
  "& .MuiAutocomplete-option": {
    borderRadius: 1,
    "&:hover, &[aria-selected='true'], &[aria-selected='true'].Mui-focused": {
      bgcolor: "rgba(225, 99, 40, 0.12)",
      color: "brand.cta",
    },
  },
};

export const autocompleteOptionCheckboxSx: SxProps<Theme> = {
  mr: 1,
  color: "brand.cta",
  "&.Mui-checked": {
    color: "brand.cta",
  },
};
