import { Navigate } from 'react-router';

import { Spin } from 'antd';

import type { TPermission } from '@constants/PERMISSIONS';

import { usePermissions } from '@hooks/usePermissions';

type TProtectedRouteProps = {
  permission: TPermission;
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<TProtectedRouteProps> = ({
  permission,
  children,
}) => {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
