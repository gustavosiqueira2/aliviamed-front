import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@store/QueryClient';

import MainRoutes from '@routes/Main.routes';

import NotificationProvider from '@contexts/NotificationContext';
import AuthProvider from '@contexts/AuthContext';
import ThemeProvider from '@contexts/ThemeContext';

import './index.css';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('pt-br');
dayjs.tz.setDefault('America/Sao_Paulo');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              <MainRoutes />
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
