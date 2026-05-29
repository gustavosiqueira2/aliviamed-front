import dayjs from 'dayjs';

import { Avatar, Button, Card } from 'antd';
import { UserRound } from 'lucide-react';

import { formatTimerRange } from '@functions/formatTimerRange';

import { useNow } from '@hooks/useNow';

import type { TAppointment } from '@store/Appointment';

type TQueuePatientProps = {
  appointment: TAppointment;
  onStartConsult: (appointmentId: string) => void;
};

const QueuePatient: React.FC<TQueuePatientProps> = (props) => {
  const { appointment, onStartConsult } = props;

  const { id, patient, startsAt, endsAt, checkedAt } = appointment;

  const now = useNow();

  const { startFormatted, duration } = formatTimerRange({
    start: dayjs(checkedAt),
    end: now,
  });

  return (
    <Card
      key={id}
      classNames={{ body: 'p-2! flex items-center justify-between' }}
    >
      <div className="flex items-center text-gray-700">
        <span className="w-20 text-xs">
          {dayjs(startsAt).format('HH:mm')} - {dayjs(endsAt).format('HH:mm')}
        </span>
        <Avatar size={24} className="mx-2! bg-blue-200/50!">
          <UserRound size={14} className="text-blue-500" />
        </Avatar>
        <b>{patient.name}</b>,
        <span className="ml-1 text-sm">
          Check-in ás {startFormatted}{' '}
          <span className="text-gray-500">({duration})</span>
        </span>
      </div>

      <Button
        className="ml-2! rounded-sm!"
        type="primary"
        onClick={() => onStartConsult(appointment.id)}
      >
        Atender
      </Button>
    </Card>
  );
};

export default QueuePatient;
