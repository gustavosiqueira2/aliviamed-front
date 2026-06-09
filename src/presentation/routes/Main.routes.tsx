import { useEffect } from 'react';

import { Route, Routes } from 'react-router';

import { Spin } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useAuth } from '@store/Auth.store';

import CompleteRegistration from '@pages/Public/CompleteRegistration/CompleteRegistration';
import Privacy from '@pages/Public/Privacy/Privacy';
import Help from '@pages/Public/Help/Help';

import Onboarding from '@pages/Auth/Onboarding/Onboarding';
import GoogleCallback from '@pages/Auth/GoogleCallback/GoogleCallback';

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
        path="*"
        element={
          !data?.accessToken ? (
            <LoginRoutes />
          ) : data.userClinics.length === 0 ||
            (data && !data.userClinics.find((uc) => uc.status === 'ACTIVE')) ? (
            <Onboarding />
          ) : (
            <AppRoutes />
          )
        }
      />

      <Route
        path={ROUTE_NAMES.COMPLETE_REGISTRATION}
        element={<CompleteRegistration />}
      />
      <Route
        path={ROUTE_NAMES.GOOGLE_CALLBACK}
        element={<GoogleCallback />}
      />
      <Route path={ROUTE_NAMES.HELP} element={<Help />} />
      <Route path={ROUTE_NAMES.PRIVACY} element={<Privacy />} />
    </Routes>
  );
};

export default MainRoutes;
