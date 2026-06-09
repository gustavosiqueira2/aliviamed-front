import { useMutation, useQuery } from '@tanstack/react-query';

import api from '../../services/api';

import { queryClient } from './QueryClient';

export type TGoogleCalendarStatus = {
  connected: boolean;
  googleEmail?: string | null;
  connectedAt?: string | null;
};

const getStatus = async (): Promise<TGoogleCalendarStatus> => {
  const { data } = await api.get<TGoogleCalendarStatus>(
    '/google-calendar/status',
  );

  return data;
};

export const useGoogleCalendarStatus = () =>
  useQuery({
    queryKey: ['GOOGLE_CALENDAR_STATUS'],
    queryFn: getStatus,
  });

const connect = async (): Promise<void> => {
  const { data } = await api.get<{ url: string }>('/google-calendar/connect');

  window.location.href = data.url;
};

export const useConnectGoogleCalendar = () =>
  useMutation({ mutationFn: connect });

const disconnect = async (): Promise<void> => {
  await api.delete('/google-calendar/disconnect');
};

export const useDisconnectGoogleCalendar = () =>
  useMutation({
    mutationFn: disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GOOGLE_CALENDAR_STATUS'] });
    },
  });
