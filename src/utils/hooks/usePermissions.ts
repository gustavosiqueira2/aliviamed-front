import type { TPermission } from '@constants/PERMISSIONS';

import { useAuth } from '@store/AuthStore';
import { useClinic } from '@store/ClinicStore';

export const usePermissions = () => {
  const { data: auth } = useAuth();
  const { data: clinic, isLoading } = useClinic();

  const permissions =
    clinic?.participants.find((p) => p.userId === auth?.user.id)?.permissions ??
    [];

  const hasPermission = (perm: TPermission) => permissions.includes(perm);

  const hasAny = (perms: TPermission[]) => perms.some(hasPermission);

  return { permissions, hasPermission, hasAny, isLoading };
};
