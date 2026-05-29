import { useEffect } from 'react';

import { Spin } from 'antd';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useAuth } from '@store/AuthStore';

import LoginRoutes from './Login.routes';
import AppRoutes from './App.routes';

const MainRoutes = () => {
  const { notify } = useNotificationContext();

  const { data, isLoading, isError } = useAuth();

  useEffect(() => {
    if (isError) {
      notify({
        type: 'warning',
        title: 'Sessão expirada',
        description:
          'Por favor insira suas credenciais novamente para entrar na aplicação.',
      });
    }
  }, [isError, notify]);

  if (isLoading)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <Spin size="large" />
      </div>
    );

  if (!data?.accessToken) {
    return <LoginRoutes />;
  }

  return <AppRoutes />;
};

export default MainRoutes;
