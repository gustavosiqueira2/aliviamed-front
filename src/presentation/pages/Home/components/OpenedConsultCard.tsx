import { useNavigate } from 'react-router';

import { Alert, Button, theme, Typography } from 'antd';
import { Podcast } from 'lucide-react';

import { PERMISSIONS } from '@constants/PERMISSIONS';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import Can from '@components/Can/Can';

const { Title } = Typography;

type TOpenedConsultCardProps = {
  patientName: string;
  appointmentId: string;
};

const OpenedConsultCard: React.FC<TOpenedConsultCardProps> = (props) => {
  const { patientName, appointmentId } = props;

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <Alert
      showIcon
      icon={<Podcast size={18} color={colorPrimary} />}
      title={
        <div className="flex items-center justify-between gap-2">
          <Title
            level={5}
            style={{ color: colorPrimary }}
            className="my-0! font-normal!"
          >
            Você tem uma consulta com <b> {patientName}</b> em andamento!{' '}
          </Title>

          <Can permission={PERMISSIONS.CONSULT_UPDATE}>
            <Button
              type="primary"
              onClick={() => navigate(`${ROUTE_NAMES.CONSULT}/${appointmentId}`)}
            >
              Continuar consulta
            </Button>
          </Can>
        </div>
      }
    />
  );
};

export default OpenedConsultCard;
