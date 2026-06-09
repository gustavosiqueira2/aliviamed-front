import { Steps, Tooltip } from 'antd';
import { Check } from 'lucide-react';

import {
  APPOINTMENT_STATUS,
  type TAppointmentStatus,
} from '@constants/APPOINTMENT_STATUS';

const STEP_FLOW: TAppointmentStatus[] = [
  APPOINTMENT_STATUS.SCHEDULED,
  APPOINTMENT_STATUS.CONFIRMED,
  APPOINTMENT_STATUS.WAITING_CONSULTATION,
  APPOINTMENT_STATUS.IN_CONSULTATION,
  APPOINTMENT_STATUS.COMPLETED,
];

const STEP_LABELS = [
  'Agendado',
  'Confirmado',
  'Check-in',
  'Em cons.',
  'Concluído',
];

type TAppointmentStatusStepsProps = {
  status: TAppointmentStatus;
};

const AppointmentStatusSteps = ({ status }: TAppointmentStatusStepsProps) => {
  const interrupted =
    status === APPOINTMENT_STATUS.CANCELED ||
    status === APPOINTMENT_STATUS.NO_SHOW;

  if (interrupted) {
    return;
  }

  const current = STEP_FLOW.indexOf(status);

  return (
    <Steps
      size="small"
      titlePlacement="vertical"
      current={current}
      status={status === APPOINTMENT_STATUS.COMPLETED ? 'finish' : 'process'}
      items={STEP_LABELS.map((s, i) => ({
        icon: (
          <Tooltip title={s}>
            <div
              className={
                current === i ? 'rounded-full bg-purple-500/20 p-1' : ''
              }
            >
              <div
                className={`${
                  current === i ? 'bg-purple-500' : 'bg-gray-500'
                } flex min-h-4 min-w-4 items-center justify-center rounded-full`}
              >
                <Check size={12} className="text-white!" />
              </div>
            </div>
          </Tooltip>
        ),
      }))}
    />
  );
};

export default AppointmentStatusSteps;
