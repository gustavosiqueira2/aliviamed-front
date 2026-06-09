import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router';

import { Spin } from 'antd';

import { LOCAL_STORAGE_TOKEN_KEY } from '@constants/LOCAL_STORAGE_KEYS';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { queryClient } from '@store/QueryClient';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notify } = useNotificationContext();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      notify({
        type: 'error',
        title: 'Não foi possível entrar com o Google',
        description: 'Tente novamente ou use seu e-mail e senha.',
      });

      navigate(ROUTE_NAMES.SIGN_IN, { replace: true });

      return;
    }

    window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

    void queryClient
      .invalidateQueries({ queryKey: ['AUTH'] })
      .then(() => navigate(ROUTE_NAMES['/'], { replace: true }));
  }, [searchParams, navigate, notify]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default GoogleCallback;
