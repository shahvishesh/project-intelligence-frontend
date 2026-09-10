import { useQuery } from "@tanstack/react-query";

import { getProjectAccess } from "../api/projectApi";

export function useProjectAccess(projectId: number) {
  const query = useQuery({
    queryKey: ["projects", projectId, "access"],
    queryFn: () => getProjectAccess(projectId),
  });

  const can = (permission: string): boolean => {
    return query.data?.permissions.includes(permission) ?? false;
  };

  return {
    ...query,
    can,
  };
}
