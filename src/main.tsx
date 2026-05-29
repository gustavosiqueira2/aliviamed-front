import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@store/QueryClient';

import { theme } from '@assets/theme';

import MainRoutes from '@routes/Main.routes';

import NotificationProvider from '@contexts/NotificationContext';
import AuthProvider from '@contexts/AuthContext';

import './index.css';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('pt-br');
dayjs.tz.setDefault('America/Sao_Paulo');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <NotificationProvider>
        <AuthProvider>
          <ConfigProvider theme={theme} locale={ptBR}>
            <BrowserRouter>
              <MainRoutes />
            </BrowserRouter>
          </ConfigProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
);
