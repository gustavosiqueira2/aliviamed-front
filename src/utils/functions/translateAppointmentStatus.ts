import { APPOINTMENT_STATUS } from '@constants/APPOINTMENT_STATUS';

export const translateAppointmentStatus = (
  status: keyof typeof APPOINTMENT_STATUS,
) => {
  switch (status) {
    case APPOINTMENT_STATUS.SCHEDULED:
      return 'Agendado';
    case APPOINTMENT_STATUS.CONFIRMED:
      return 'Confirmado';
    case APPOINTMENT_STATUS.WAITING_CONSULTATION:
      return 'Aguardando atendimento';
    case APPOINTMENT_STATUS.IN_CONSULTATION:
      return 'Em atendimento';
    case APPOINTMENT_STATUS.COMPLETED:
      return 'Completo';
    case APPOINTMENT_STATUS.CANCELED:
      return 'Cancelado';
    case APPOINTMENT_STATUS.NO_SHOW:
      return 'Não compareceu';
  }
};
