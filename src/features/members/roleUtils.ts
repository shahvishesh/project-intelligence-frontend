export const formatRoleLabel = (roleName: string) =>
  roleName
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
