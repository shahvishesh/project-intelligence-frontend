import { useQuery } from "@tanstack/react-query";

import { getAvailableProjectMembers } from "../api/projectApi";

export function useAvailableProjectMembers(projectId: number) {
  return useQuery({
    queryKey: ["projects", projectId, "available-members"],
    queryFn: () => getAvailableProjectMembers(projectId),
  });
}
