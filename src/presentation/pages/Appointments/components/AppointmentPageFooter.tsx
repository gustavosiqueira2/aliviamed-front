import { Card, Tag } from 'antd';

import {
  APPOINTMENT_STATUS,
  type TAppointmentStatus,
} from '@constants/APPOINTMENT_STATUS';
import { EVENT_COLOR } from '@constants/EVENT_COLOR';

type TAppointmentPageFooterProps = {
  filters: Record<TAppointmentStatus, boolean>;
  onChangeFilter: (filter: keyof typeof APPOINTMENT_STATUS) => void;
};

const AppointmentPageFooter: React.FC<TAppointmentPageFooterProps> = (
  props,
) => {
  const { filters, onChangeFilter } = props;

  return (
    <Card className="mt-2!" classNames={{ body: 'p-0!' }}>
      <div className="ml-1 flex items-center gap-2 p-2">
        <Tag
          onClick={() => onChangeFilter(APPOINTMENT_STATUS.SCHEDULED)}
          variant={filters.SCHEDULED ? 'solid' : 'outlined'}
          color={EVENT_COLOR.SCHEDULED}
          className="flex! cursor-pointer items-center gap-1 py-0.5!"
        >
          Agendado
        </Tag>
        <Tag
          onClick={() => onChangeFilter(APPOINTMENT_STATUS.CONFIRMED)}
          variant={filters.CONFIRMED ? 'solid' : 'outlined'}
          color={EVENT_COLOR.CONFIRMED}
          className="flex! cursor-pointer items-center gap-1 py-0.5!"
        >
          Confirmado
        </Tag>
        <Tag
          onClick={() =>
            onChangeFilter(APPOINTMENT_STATUS.WAITING_CONSULTATION)
          }
          variant={filters.WAITING_CONSULTATION ? 'solid' : 'outlined'}
          color={EVENT_COLOR.WAITING_CONSULTATION}
          className="flex! cursor-pointer items-center gap-1 py-0.5!"
        >
          Aguardando consulta
        </Tag>
        <Tag
          onClick={() => onChangeFilter(APPOINTMENT_STATUS.IN_CONSULTATION)}
          variant={filters.IN_CONSULTATION ? 'solid' : 'outlined'}
          color={EVENT_COLOR.IN_CONSULTATION}
          className="flex! cursor-pointer items-center gap-1 py-0.5!"
        >
          Em consulta
        </Tag>
        <Tag
          onClick={() => onChangeFilter(APPOINTMENT_STATUS.COMPLETED)}
          variant={filters.COMPLETED ? 'solid' : 'outlined'}
          color={EVENT_COLOR.COMPLETED}
          className="flex! cursor-pointer items-center gap-1 py-0.5!"
        >
          Completo
        </Tag>
        <Tag
          onClick={() => onChangeFilter(APPOINTMENT_STATUS.CANCELED)}
          variant={filters.CANCELED ? 'solid' : 'outlined'}
          color={EVENT_COLOR.CANCELED}
          className="flex! cursor-pointer items-center gap-1 py-0.5!"
        >
          Cancelado
        </Tag>
        <Tag
          onClick={() => onChangeFilter(APPOINTMENT_STATUS.NO_SHOW)}
          variant={filters.NO_SHOW ? 'solid' : 'outlined'}
          color={EVENT_COLOR.NO_SHOW}
          className="flex! cursor-pointer items-center gap-1 py-0.5!"
        >
          Não compareceu
        </Tag>
      </div>
    </Card>
  );
};

export default AppointmentPageFooter;
