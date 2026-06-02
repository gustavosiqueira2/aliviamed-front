import dayjs from 'dayjs';

import { Avatar, Button, Card, Typography } from 'antd';
import { UserRound } from 'lucide-react';

import { PERMISSIONS } from '@constants/PERMISSIONS';

import { formatTimerRange } from '@functions/formatTimerRange';

import { useNow } from '@hooks/useNow';

import type { TAppointment } from '@store/Appointment';

import Can from '@components/Can/Can';

const { Text } = Typography;

type TQueuePatientProps = {
  disabled: boolean;
  appointment: TAppointment;
  onStartConsult: (appointmentId: string) => void;
};

const QueuePatient: React.FC<TQueuePatientProps> = (props) => {
  const { disabled, appointment, onStartConsult } = props;

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
      <div className="flex items-center">
        <Text className="w-20 text-xs!">
          {dayjs(startsAt).format('HH:mm')} - {dayjs(endsAt).format('HH:mm')}
        </Text>
        <Avatar size={24} className="mx-2! bg-blue-200!">
          <UserRound size={14} className="text-blue-500" />
        </Avatar>
        <b>{patient.name}</b>,
        <Text className="ml-1">
          Check-in ás {startFormatted} ({duration})
        </Text>
      </div>

      <Can permission={PERMISSIONS.CONSULT_START}>
        <Button
          className="ml-2! rounded-sm!"
          type="primary"
          disabled={disabled}
          onClick={() => onStartConsult(appointment.id)}
        >
          Atender
        </Button>
      </Can>
    </Card>
  );
};

export default QueuePatient;
