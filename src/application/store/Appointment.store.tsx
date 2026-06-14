import dayjs, { Dayjs } from 'dayjs';

import { useMutation, useQueries, useQuery } from '@tanstack/react-query';

import {
  APPOINTMENT_STATUS,
  type TAppointmentStatus,
} from '@constants/APPOINTMENT_STATUS';

import type {
  TAppointment,
  TAppointmentDetail,
  TAppointmentStatusChange,
  TAppointmentCreatePayload,
  TAppointmentResponse,
  TAppointmentReturn,
  TAppointmentQuery,
  TAppointmentReschedulePayload,
  TNextAppointment,
} from '@interfaces/Appointment.interface';

import api from '../../services/api';

import { queryClient } from './QueryClient';

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

const getAppointments = async ({
  date,
  status,
  professionalId,
}: TAppointmentQuery): Promise<TAppointmentResponse> => {
  const { data } = await api.get<TAppointmentReturn>('/appointment', {
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

const getAppointment = async (id: string): Promise<TAppointmentDetail> => {
  const { data } = await api.get<TAppointmentDetail>(`/appointment/${id}`);

  return data;
};

export const useAppointment = (id?: string) =>
  useQuery({
    queryKey: ['APPOINTMENT', id],
    queryFn: () => getAppointment(id!),
    enabled: !!id,
  });

export const usePatientNextAppointment = (
  patientId?: string,
  enabled = true,
) =>
  useQuery({
    queryKey: ['PATIENT-NEXT-APPOINTMENT', patientId],
    queryFn: () => getPatientNextAppointment(patientId!),
    enabled: enabled && !!patientId,
  });

const getPatientNextAppointment = async (
  patientId: string,
): Promise<TNextAppointment | null> => {
  const { data } = await api.get<TNextAppointment | null>(
    `/appointment/patient/${patientId}/next`,
  );

  return data;
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

const createAppointment = async (data: TAppointmentCreatePayload) => {
  const { professionalId, patientId, date, startHour, endHour, type, price } =
    data;

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
    ...(type ? { type } : {}),
    ...(price != null ? { price } : {}),
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

const rescheduleAppointment = async (props: TAppointmentReschedulePayload) => {
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
  status: TAppointmentStatusChange;
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
