import type { TPermission } from '@constants/PERMISSIONS';

import { usePermissions } from '@hooks/usePermissions';

type TCanProps = {
  /** Exige esta permissão. */
  permission?: TPermission;
  /** Exige QUALQUER uma destas permissões. */
  any?: TPermission[];
  /** Renderizado quando o usuário não tem a permissão (default: nada). */
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Esconde os children quando o usuário logado não tem a permissão exigida.
 *
 *   <Can permission={PERMISSIONS.PATIENT_CREATE}>...</Can>
 *   <Can any={[PERMISSIONS.APPOINTMENT_CANCEL, PERMISSIONS.APPOINTMENT_RESCHEDULE]}>...</Can>
 */
const Can: React.FC<TCanProps> = ({ permission, any, fallback = null, children }) => {
  const { hasPermission, hasAny } = usePermissions();

  const allowed =
    (permission ? hasPermission(permission) : true) &&
    (any ? hasAny(any) : true);

  return <>{allowed ? children : fallback}</>;
};

export default Can;
