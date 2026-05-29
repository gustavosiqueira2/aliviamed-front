import dayjs from 'dayjs';

import { useMutation, useQuery } from '@tanstack/react-query';

import type { TAppointmentStatus } from '@constants/APPOINTMENT_STATUS';

import api from '../../services/api';

import { queryClient } from './QueryClient';

type TCreateConsultApiReturn = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  complaint: string | null;
  evolution: string | null;
  diagnosis: string | null;
  prescription: string | null;
  notes: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  appointment: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    startsAt: Date;
    endsAt: Date;
    status: TAppointmentStatus;
    canceledAt: Date | null;
    canceledByUserId: string | null;
    professional: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
    };
    consultation: null;
  };
};

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
  const { data } = await api.post<TCreateConsultApiReturn>(
    `consult/start/${appointmentId}`,
  );

  return data;
};

export type TGetConsultApiReturn = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date;
  finishedAt: string | null;
  complaint: string | null;
  evolution: string | null;
  diagnosis: string | null;
  prescription: string | null;
  notes: string | null;
  appointment: {
    id: string;
    status: TAppointmentStatus;
    startsAt: Date;
    endsAt: Date;
  };
  patient: {
    id: string;
    name: string;
    birthdate: Date;
  };
  professional: {
    id: string;
    name: string;
  };
};

export const useActiveConsult = () =>
  useQuery({
    queryKey: ['ACTIVE_CONSULT'],
    queryFn: getActiveConsult,
  });

const getActiveConsult = async () => {
  const { data } = await api.get<TGetConsultApiReturn>('consult/active/me');

  return data;
};

export const useConsultByAppointmentId = (appointmentId: string) =>
  useQuery({
    queryKey: ['APPOINTMENT_CONSULT', appointmentId],
    queryFn: () => getConsultByAppointmentId(appointmentId),
  });

const getConsultByAppointmentId = async (appointmentId: string) => {
  const { data } = await api.get<TGetConsultApiReturn>(
    `consult/appointment/${appointmentId}`,
  );

  return data;
};

export type TUpdateConsultDto = {
  complaint?: null | string;
  evolution?: null | string;
  diagnosis?: null | string;
  prescription?: null | string;
  notes?: null | string;
};

export const useUpdateConsult = () =>
  useMutation({ mutationFn: updateConsult });

const updateConsult = async ({
  id,
  payload,
}: {
  id?: string;
  payload: TUpdateConsultDto;
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

const finishConsult = async (consult: TGetConsultApiReturn) => {
  await api.post(`consult/finish/${consult.id}`);
};
