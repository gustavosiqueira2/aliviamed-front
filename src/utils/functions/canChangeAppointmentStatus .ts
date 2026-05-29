import type { TAppointmentStatus } from '@constants/APPOINTMENT_STATUS';

import {
  appointmentStatusRules,
  type TAppointmentStatusActions,
} from '@constants/APPOINTMENT_STATUS_RULES';

export const canChangeAppointmentStatus = (
  currentStatus: TAppointmentStatus,
  action: TAppointmentStatusActions,
) => appointmentStatusRules[action].includes(currentStatus);
