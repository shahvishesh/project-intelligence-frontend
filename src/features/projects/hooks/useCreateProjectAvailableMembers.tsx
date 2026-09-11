import { useQuery } from "@tanstack/react-query";

import { getCreateProjectAvailableMembers } from "../api/projectApi";

export function useCreateProjectAvailableMembers() {
  return useQuery({
    queryKey: ["projects", "available-members"],
    queryFn: getCreateProjectAvailableMembers,
  });
}
