import dayjs from 'dayjs';

import { useMutation, useQuery } from '@tanstack/react-query';

import type {
  TConsultCreateReturn,
  TConsult,
  TConsultUpdatePayload,
} from '@interfaces/Consult.interface';

import api from '../../services/api';

import { queryClient } from './QueryClient';

export const useCreateConsult = () =>
  useMutation({
    mutationFn: createConsult,
    onSuccess: (data) => {
      const formattedDate = dayjs(data.appointment.startsAt).format(
        'YYYY-MM-DD',
      );

      queryClient.invalidateQueries({
        queryKey: ['APPOINTMENTS', formattedDate],
        exact: false,
      });
    },
  });

const createConsult = async (appointmentId: string) => {
  const { data } = await api.post<TConsultCreateReturn>(
    `consult/start/${appointmentId}`,
  );

  return data;
};

export const useActiveConsult = () =>
  useQuery({
    queryKey: ['ACTIVE_CONSULT'],
    queryFn: getActiveConsult,
  });

const getActiveConsult = async () => {
  const { data } = await api.get<TConsult>('consult/active/me');

  return data;
};

export const useConsultByAppointmentId = (appointmentId: string) =>
  useQuery({
    queryKey: ['APPOINTMENT_CONSULT', appointmentId],
    queryFn: () => getConsultByAppointmentId(appointmentId),
  });

const getConsultByAppointmentId = async (appointmentId: string) => {
  const { data } = await api.get<TConsult>(
    `consult/appointment/${appointmentId}`,
  );

  return data;
};

export const useUpdateConsult = () =>
  useMutation({ mutationFn: updateConsult });

const updateConsult = async ({
  id,
  payload,
}: {
  id?: string;
  payload: TConsultUpdatePayload;
}) => {
  if (!id) return;

  const { data } = await api.patch(`/consult/${id}`, payload);

  return data;
};

export const useFinishConsult = () =>
  useMutation({
    mutationFn: finishConsult,
    onSuccess: (_, consult) => {
      const formattedDate = dayjs(consult.appointment.startsAt).format(
        'YYYY-MM-DD',
      );
      queryClient.invalidateQueries({
        queryKey: ['APPOINTMENTS', formattedDate],
        exact: false,
      });

      queryClient.removeQueries({ queryKey: ['ACTIVE_CONSULT'] });
      queryClient.removeQueries({
        queryKey: ['APPOINTMENT_CONSULT'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['PATIENT_CONSULT_HISTORY'],
        exact: false,
      });
    },
  });

const finishConsult = async (consult: TConsult) => {
  await api.post(`consult/finish/${consult.id}`);
};
