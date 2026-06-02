import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { Input, Modal, Typography } from 'antd';

import type { TAppointment } from '@store/Appointment';

const { Paragraph } = Typography;
const { TextArea } = Input;

type TCancelAppointmentModalProps = {
  open: boolean;
  appointment?: TAppointment;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: (cancelReason?: string) => void;
};

const CancelAppointmentModal: React.FC<TCancelAppointmentModalProps> = (
  props,
) => {
  const { open, appointment, isPending, onClose, onConfirm } = props;

  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (open) setCancelReason('');
  }, [open]);

  return (
    <Modal
      title="Cancelar agendamento"
      open={open}
      okText="Confirmar cancelamento"
      cancelText="Voltar"
      okButtonProps={{ danger: true, loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
      onCancel={() => !isPending && onClose()}
      onOk={() => onConfirm(cancelReason.trim() || undefined)}
    >
      {appointment && (
        <Paragraph>
          Confirmar cancelamento do agendamento do paciente{' '}
          <b>{appointment.patient.name}</b> na data e horário{' '}
          <b>{dayjs(appointment.startsAt).format('DD/MM/YYYY HH:mm')}</b>.
        </Paragraph>
      )}

      <label className="mb-1 block">
        Motivo do cancelamento <span className="text-gray-400">(opcional)</span>
      </label>
      <TextArea
        rows={3}
        maxLength={500}
        value={cancelReason}
        disabled={isPending}
        placeholder="Descreva o motivo do cancelamento"
        onChange={(e) => setCancelReason(e.target.value)}
      />
    </Modal>
  );
};

export default CancelAppointmentModal;
