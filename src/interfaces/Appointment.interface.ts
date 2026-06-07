import type { Dayjs } from 'dayjs';

import {
  APPOINTMENT_STATUS,
  type TAppointmentStatus,
} from '@constants/APPOINTMENT_STATUS';

import type { ApiMeta } from '@interfaces/ApiMeta.interface';

export type TAppointment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startsAt: Date;
  endsAt: Date;
  status: keyof typeof APPOINTMENT_STATUS;
  type: TAppointmentType;
  checkedAt: Date | null;
  canceledAt: Date | null;
  canceledByUserId: string | null;
  cancelReason: string | null;
  patient: {
    id: string;
    name: string;
  };
  professional: {
    id: string;
    name: string;
  };
};

export type TAppointmentReturn = {
  data: TAppointment[];
  meta: ApiMeta;
};

export type TAppointmentResponse = {
  day: Dayjs;
  data: TAppointment[];
  meta: ApiMeta;
};

export type TAppointmentQuery = {
  date: string;
  status?: TAppointmentStatus;
  professionalId?: string;
};

export type TAppointmentType = 'DEFAULT' | 'RETURN' | 'URGENT';

export type TAppointmentCreatePayload = {
  professionalId: string;
  patientId: string;
  date: Date;
  startHour: string;
  endHour: string;
  type?: TAppointmentType;
  price?: number | null;
};

export type TAppointmentReschedulePayload = {
  appointment: TAppointment;
  date: Date;
  startHour: string;
  endHour: string;
};

export type TAppointmentStatusChange =
  | typeof APPOINTMENT_STATUS.CONFIRMED
  | typeof APPOINTMENT_STATUS.WAITING_CONSULTATION
  | typeof APPOINTMENT_STATUS.COMPLETED
  | typeof APPOINTMENT_STATUS.NO_SHOW
  | typeof APPOINTMENT_STATUS.CANCELED;
