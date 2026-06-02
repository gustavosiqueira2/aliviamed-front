import dayjs, { Dayjs } from 'dayjs';

import { useMutation, useQueries } from '@tanstack/react-query';

import {
  APPOINTMENT_STATUS,
  type TAppointmentStatus,
} from '@constants/APPOINTMENT_STATUS';

import type { ApiMeta } from '@interfaces/ApiMeta.interface';

import api from '../../services/api';

import { queryClient } from './QueryClient';

export type TAppointment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startsAt: Date;
  endsAt: Date;
  status: keyof typeof APPOINTMENT_STATUS;
  checkedAt: Date | null;
  canceledAt: Date | null;
  canceledByUserId: string | null;
  patient: {
    id: string;
    name: string;
  };
  professional: {
    id: string;
    name: string;
  };
};

export const useAppointments = (
  dates: Dayjs[],
  filters?: {
    status?: TAppointmentStatus;
    professionalId?: string;
  },
) => {
  return useQueries({
    queries: dates.map((date) => {
      const formattedDate = date.format('YYYY-MM-DD');

      return {
        queryKey: ['APPOINTMENTS', formattedDate, filters],
        queryFn: () =>
          getAppointments({
            date: formattedDate,
            status: filters?.status,
            professionalId: filters?.professionalId,
          }),
        staleTime: 1000 * 60 * 60,
      };
    }),
  });
};

type TGetAppointmentReturn = {
  data: TAppointment[];
  meta: ApiMeta;
};

export type TGetAppointmentResponse = {
  day: Dayjs;
  data: TAppointment[];
  meta: ApiMeta;
};

type TGetAppointmentsParams = {
  date: string;
  status?: TAppointmentStatus;
  professionalId?: string;
};

const getAppointments = async ({
  date,
  status,
  professionalId,
}: TGetAppointmentsParams): Promise<TGetAppointmentResponse> => {
  const { data } = await api.get<TGetAppointmentReturn>('/appointment', {
    params: {
      date,
      status,
      professionalId,
    },
  });

  return {
    day: dayjs(date),
    ...data,
  };
};

export const useCreateAppointment = () =>
  useMutation({
    mutationFn: createAppointment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['APPOINTMENTS', dayjs(variables.date).format('YYYY-MM-DD')],
      });
    },
  });

type TCreateAppointmentData = {
  professionalId: string;
  patientId: string;
  date: Date;
  startHour: string;
  endHour: string;
};

const createAppointment = async (data: TCreateAppointmentData) => {
  const { professionalId, patientId, date, startHour, endHour } = data;

  const [startHourValue, startMinuteValue] = startHour.split(':');
  const [endHourValue, endMinuteValue] = endHour.split(':');

  const startsAt = dayjs(date)
    .hour(Number(startHourValue))
    .minute(Number(startMinuteValue))
    .second(0)
    .millisecond(0);

  const endsAt = dayjs(date)
    .hour(Number(endHourValue))
    .minute(Number(endMinuteValue))
    .second(0)
    .millisecond(0);

  const payload = {
    professionalId,
    patientId,
    startsAt,
    endsAt,
  };

  await api.post('/appointment', payload);
};

export const useRescheduleAppointment = () =>
  useMutation({
    mutationFn: rescheduleAppointment,
    onSuccess: (_, { appointment, date }) => {
      queryClient.invalidateQueries({
        queryKey: [
          'APPOINTMENTS',
          dayjs(appointment.startsAt).format('YYYY-MM-DD'),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['APPOINTMENTS', dayjs(date).format('YYYY-MM-DD')],
      });
    },
  });

type TRescheduleAppointmentData = {
  appointment: TAppointment;
  date: Date;
  startHour: string;
  endHour: string;
};

const rescheduleAppointment = async (props: TRescheduleAppointmentData) => {
  const { appointment, date, startHour, endHour } = props;

  const [startHourValue, startMinuteValue] = startHour.split(':');
  const [endHourValue, endMinuteValue] = endHour.split(':');

  const startsAt = dayjs(date)
    .hour(Number(startHourValue))
    .minute(Number(startMinuteValue))
    .second(0)
    .millisecond(0);

  const endsAt = dayjs(date)
    .hour(Number(endHourValue))
    .minute(Number(endMinuteValue))
    .second(0)
    .millisecond(0);

  await api.patch(`/appointment/${appointment.id}/reschedule`, {
    startsAt,
    endsAt,
  });
};

export type TChangeStatusOptions =
  | typeof APPOINTMENT_STATUS.CONFIRMED
  | typeof APPOINTMENT_STATUS.WAITING_CONSULTATION
  | typeof APPOINTMENT_STATUS.COMPLETED
  | typeof APPOINTMENT_STATUS.NO_SHOW
  | typeof APPOINTMENT_STATUS.CANCELED;

export const useChangeAppointmentStatus = () =>
  useMutation({
    mutationFn: changeAppointmentStatus,
    onSuccess: (_, { appointment }) => {
      queryClient.invalidateQueries({
        queryKey: [
          'APPOINTMENTS',
          dayjs(appointment.startsAt).format('YYYY-MM-DD'),
        ],
      });
    },
  });

const changeAppointmentStatus = async ({
  appointment,
  status,
  cancelReason,
}: {
  appointment: TAppointment;
  status: TChangeStatusOptions;
  cancelReason?: string;
}) => {
  await api.patch(
    `/appointment/${appointment.id}/${
      status === APPOINTMENT_STATUS.CONFIRMED
        ? 'confirm'
        : status === APPOINTMENT_STATUS.WAITING_CONSULTATION
          ? 'waiting-consultation'
          : status === APPOINTMENT_STATUS.COMPLETED
            ? 'complete'
            : status === 'NO_SHOW'
              ? 'no-show'
              : status === APPOINTMENT_STATUS.CANCELED && 'cancel'
    }`,
    status === APPOINTMENT_STATUS.CANCELED ? { cancelReason } : undefined,
  );
};
