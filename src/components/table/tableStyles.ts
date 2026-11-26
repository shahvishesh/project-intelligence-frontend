import type { SxProps, Theme } from "@mui/material/styles";

export const dataTableContainerSx: SxProps<Theme> = {
  overflowX: "auto",
  border: "1px solid",
  borderColor: "surface.border",
  borderRadius: 1,
  backgroundColor: "#fbfaf8",
  "& th, & td": {
    borderBottom: "1px solid #e6e5dd",
    py: 1.75,
  },
  "& tbody tr:hover": {
    backgroundColor: "#faf9f0",
  },
  "& tbody tr:last-child td": {
    borderBottom: 0,
  },
};

export const dataTableHeadRowSx: SxProps<Theme> = {
  "& th": {
    fontWeight: 600,
    fontSize: "0.75rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    backgroundColor: "background.default",
    borderBottom: "1px solid",
    borderBottomColor: "surface.border",
  },
};

export const dataTablePrimaryCellSx: SxProps<Theme> = {
  fontWeight: 500,
};

export const dataTableActionsCellSx: SxProps<Theme> = {
  textAlign: "center",
};

export const dataTableActionsStackSx: SxProps<Theme> = {
  justifyContent: "center",
  alignItems: "center",
};

export const dataTableEmptyStateCellSx: SxProps<Theme> = {
  py: 6,
  color: "text.secondary",
};
