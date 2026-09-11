import type { ChipProps } from "@mui/material/Chip";

import type { ProjectStatus } from "../api/projectApi";

export function getProjectStatusColor(
  status: ProjectStatus,
): ChipProps["color"] {
  switch (status) {
    case "PLANNED":
      return "info";
    case "ACTIVE":
      return "success";
    case "COMPLETED":
      return "primary";
    case "CANCELLED":
      return "error";
  }
}
