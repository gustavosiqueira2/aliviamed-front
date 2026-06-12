import { useMutation, useQuery } from '@tanstack/react-query';

import type { TPublicAppointment } from '@interfaces/PublicAppointment.interface';

import api from '../../services/api';

const getPublicAppointment = async (
  token: string,
): Promise<TPublicAppointment> => {
  const { data } = await api.get<TPublicAppointment>('/public/appointment', {
    params: { token },
  });

  return data;
};

export const usePublicAppointment = (token: string) =>
  useQuery({
    queryKey: ['PUBLIC_APPOINTMENT', token],
    queryFn: () => getPublicAppointment(token),
    enabled: !!token,
    retry: false,
  });

const confirmAppointment = async (token: string) => {
  await api.post('/public/appointment/confirm', { token });
};

export const useConfirmAppointment = () =>
  useMutation({
    mutationFn: confirmAppointment,
  });

const declineAppointment = async (token: string) => {
  await api.post('/public/appointment/decline', { token });
};

export const useDeclineAppointment = () =>
  useMutation({
    mutationFn: declineAppointment,
  });
