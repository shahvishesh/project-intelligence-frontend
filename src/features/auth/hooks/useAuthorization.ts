import { useCurrentUser } from './useCurrentUser';

export function useAuthorization() {
  const { data: currentUser, ...query } = useCurrentUser();

  const can = (permission: string): boolean => {
    return currentUser?.systemPermissions.includes(permission) ?? false;
  };

  return {
    can,
    currentUser,
    ...query,
  };
}
