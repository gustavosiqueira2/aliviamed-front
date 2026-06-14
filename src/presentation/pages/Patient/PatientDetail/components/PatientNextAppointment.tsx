import dayjs from 'dayjs';

import { Alert, Skeleton, theme, Typography } from 'antd';
import { Calendar } from 'lucide-react';

import type { TAppointmentType } from '@interfaces/Appointment.interface';

import { usePatientNextAppointment } from '@store/Appointment.store';

const { Title, Text } = Typography;

const TYPE_LABELS: Record<TAppointmentType, string> = {
  DEFAULT: 'Consulta',
  RETURN: 'Retorno',
  URGENT: 'Urgência',
};

type TPatientNextAppointmentProps = {
  patientId: string;
  enabled: boolean;
};

const PatientNextAppointment: React.FC<TPatientNextAppointmentProps> = ({
  patientId,
  enabled,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { data, isLoading } = usePatientNextAppointment(patientId, enabled);

  if (!enabled) {
    return null;
  }

  return (
    <Alert
      style={{
        borderColor: colorPrimary + '40',
        background: colorPrimary + '10',
      }}
      className="mt-4!"
      title={
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Calendar style={{ color: colorPrimary }} size={16} />

            <Text style={{ color: colorPrimary }} className="font-semibold!">
              Próxima consulta
            </Text>
          </div>

          {isLoading ? (
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 2, width: ['60%', '80%'] }}
              className="mt-3!"
            />
          ) : data ? (
            <>
              <Title level={5} className="mt-0.5! mb-0!">
                {dayjs(data.startsAt).format('DD MMM · HH:mm')}
              </Title>
              <Text type="secondary">
                {data.professional.name} · {TYPE_LABELS[data.type]}
              </Text>
            </>
          ) : (
            <Text type="secondary" className="mt-2!">
              Nenhuma consulta agendada
            </Text>
          )}
        </div>
      }
    />
  );
};

export default PatientNextAppointment;
