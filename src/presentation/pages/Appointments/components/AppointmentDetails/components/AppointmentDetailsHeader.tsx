import { Button, Tooltip, Typography } from 'antd';
import { Pencil, X } from 'lucide-react';

import { PERMISSIONS } from '@constants/PERMISSIONS';

import Can from '@components/Can/Can';

const { Title } = Typography;

type TAppointmentDetailsHeaderProps = {
  isRescheduling: boolean;
  onReschedule: () => void;
  onCloseDetails: () => void;
};

const AppointmentDetailsHeader: React.FC<TAppointmentDetailsHeaderProps> = (
  props,
) => {
  const { isRescheduling, onReschedule, onCloseDetails } = props;

  return (
    <div className="mb-1 flex items-center justify-between">
      <Title level={4} className="my-0!">
        Detalhes
      </Title>

      <div className="-mt-2 -mr-4">
        {!isRescheduling && (
          <Can permission={PERMISSIONS.APPOINTMENT_RESCHEDULE}>
            <Tooltip placement="bottom" title="Reagendar">
              <Button type="text" shape="circle" onClick={onReschedule}>
                <Pencil size={16} className="text-blue-400!" />
              </Button>
            </Tooltip>
          </Can>
        )}

        <Tooltip placement="bottom" title="Fechar">
          <Button type="text" shape="circle" onClick={onCloseDetails}>
            <X size={16} className="text-gray-400!" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default AppointmentDetailsHeader;
