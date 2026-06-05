import { useEffect } from 'react';

import { Route, Routes } from 'react-router';

import { Spin } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useAuth } from '@store/AuthStore';

import CompleteRegistration from '@pages/Auth/CompleteRegistration/CompleteRegistration';
import Onboarding from '@pages/Auth/Onboarding/Onboarding';
import Help from '@pages/Auth/Help/Help';
import Privacy from '@pages/Auth/Privacy/Privacy';

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

  return (
    <Routes>
      <Route
        path={ROUTE_NAMES.COMPLETE_REGISTRATION}
        element={<CompleteRegistration />}
      />

      <Route path={ROUTE_NAMES.HELP} element={<Help />} />
      <Route path={ROUTE_NAMES.PRIVACY} element={<Privacy />} />

      <Route
        path="*"
        element={
          !data?.accessToken ? (
            <LoginRoutes />
          ) : data.userClinics.length === 0 ? (
            <Onboarding />
          ) : (
            <AppRoutes />
          )
        }
      />
    </Routes>
  );
};

export default MainRoutes;
