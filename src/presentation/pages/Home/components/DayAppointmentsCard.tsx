import dayjs from 'dayjs';

import { Card, Empty, Typography } from 'antd';

import { EVENT_COLOR } from '@constants/EVENT_COLOR';

import type { TAppointment } from '@interfaces/Appointment.interface';

import AppointmentPageFooter from '@pages/Appointments/components/AppointmentPageFooter';

const { Title } = Typography;

type TDayAppointmentsCardProps = {
  appointments: TAppointment[];
};

const DayAppointmentsCard: React.FC<TDayAppointmentsCardProps> = (props) => {
  const { appointments } = props;

  return (
    <div className="flex flex-1 flex-col">
      <Card
        variant="borderless"
        className="flex-1"
        classNames={{ body: 'p-4!' }}
      >
        <Title level={5} className="my-0! mb-1!">
          Consultas hoje
        </Title>

        <div className="flex flex-col gap-1">
          {appointments.length > 0 ? (
            appointments.map(({ id, patient, status, startsAt, endsAt }) => (
              <div
                key={id}
                className="flex h-8 items-center rounded-sm px-2 text-sm text-white"
                style={{
                  backgroundColor: EVENT_COLOR[status],
                }}
              >
                <span>
                  {dayjs(startsAt).format('HH:mm')} -{' '}
                  {dayjs(endsAt).format('HH:mm')} {patient.name}
                </span>
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="my-4!"
              description="Nenhuma consulta para o dia de hoje."
            />
          )}
        </div>
      </Card>
      <AppointmentPageFooter
        filters={{
          NO_SHOW: true,
          CANCELED: true,
          CONFIRMED: true,
          IN_CONSULTATION: true,
          SCHEDULED: true,
          WAITING_CONSULTATION: true,
          COMPLETED: true,
        }}
        onChangeFilter={() => {}}
      />
    </div>
  );
};

export default DayAppointmentsCard;
