import {
  APPOINTMENT_STATUS,
  type TAppointmentStatus,
} from './APPOINTMENT_STATUS';

export type TAppointmentStatusActions =
  | 'confirm'
  | 'waitingConsultation'
  | 'startConsultation'
  | 'complete'
  | 'cancel'
  | 'noShow'
  | 'reschedule';

export const appointmentStatusRules: Record<
  TAppointmentStatusActions,
  readonly TAppointmentStatus[]
> = {
  confirm: [APPOINTMENT_STATUS.SCHEDULED],
  waitingConsultation: [
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.CONFIRMED,
  ],
  startConsultation: [APPOINTMENT_STATUS.WAITING_CONSULTATION],
  complete: [APPOINTMENT_STATUS.IN_CONSULTATION],
  cancel: [
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.WAITING_CONSULTATION,
  ],
  noShow: [
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.WAITING_CONSULTATION,
  ],
  reschedule: [
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.WAITING_CONSULTATION,
    APPOINTMENT_STATUS.IN_CONSULTATION,
    APPOINTMENT_STATUS.CANCELED,
    APPOINTMENT_STATUS.NO_SHOW,
  ],
};
