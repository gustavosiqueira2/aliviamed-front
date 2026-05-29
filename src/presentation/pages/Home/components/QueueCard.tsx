import { useNavigate } from 'react-router';

import { Card, Empty, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import type { TAppointment } from '@store/Appointment';

import QueuePatient from './QueuePatient';

const { Title } = Typography;

type TQueueCardProps = {
  appointments: TAppointment[];
};

const QueueCard: React.FC<TQueueCardProps> = ({ appointments }) => {
  const navigate = useNavigate();

  const handleStartConsult = (appointmentId: string) => {
    navigate(`${ROUTE_NAMES.CONSULT}/start/${appointmentId}`);
  };

  return (
    <Card
      className="flex flex-1"
      classNames={{ body: 'p-4! flex-1 flex flex-col' }}
    >
      <Title level={5} className="my-0! mb-1!">
        Fila de espera
      </Title>

      {appointments.length > 0 ? (
        <div className="flex flex-col gap-1">
          {appointments.map((appointment) => (
            <QueuePatient
              key={`queue-${appointment.id}`}
              appointment={appointment}
              onStartConsult={handleStartConsult}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-4!"
            description="Ainda não tem pacientes na sua fila."
          />
        </div>
      )}
    </Card>
  );
};

export default QueueCard;
