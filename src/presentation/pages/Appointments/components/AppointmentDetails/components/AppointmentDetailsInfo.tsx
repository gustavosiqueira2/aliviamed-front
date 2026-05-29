import { Typography } from 'antd';

import type { TAppointment } from '@store/Appointment';

const { Title, Paragraph } = Typography;

type TAppointmentDetailsInfoProps = {
  appointment: TAppointment;
};

const AppointmentDetailsInfo: React.FC<TAppointmentDetailsInfoProps> = (
  props,
) => {
  const { appointment } = props;

  return (
    <div className="mt-4 flex flex-1 flex-col justify-between">
      <div>
        <Title level={5} className="my-0!">
          Profissional:{' '}
        </Title>
        <Paragraph>{appointment.professional.name}</Paragraph>
        <Title level={5} className="my-0!">
          Paciente:{' '}
        </Title>
        <Paragraph>{appointment.patient.name}</Paragraph>
      </div>

      <span className="text-[10px] text-gray-500">ID: {appointment.id}</span>
    </div>
  );
};

export default AppointmentDetailsInfo;
