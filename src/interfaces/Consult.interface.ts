import type { TAppointmentStatus } from '@constants/APPOINTMENT_STATUS';

export type TConsultCreateReturn = {
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

export type TConsult = {
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

export type TConsultUpdatePayload = {
  complaint?: null | string;
  evolution?: null | string;
  diagnosis?: null | string;
  prescription?: null | string;
  notes?: null | string;
};
