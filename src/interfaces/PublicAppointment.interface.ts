import type { TAppointmentStatus } from '@constants/APPOINTMENT_STATUS';

import type { TAppointmentType } from '@interfaces/Appointment.interface';

export type TPublicAppointment = {
  id: string;
  status: TAppointmentStatus;
  type: TAppointmentType;
  startsAt: string;
  endsAt: string;
  specialty: string | null;
  patient: {
    name: string;
  };
  professional: {
    name: string;
  };
  clinic: {
    name: string;
    address: string | null;
  } | null;
};
