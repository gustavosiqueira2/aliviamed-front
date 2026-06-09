import dayjs from 'dayjs';

import { Button, Popconfirm, Spin, Tag, Typography } from 'antd';

import {
  useConnectGoogleCalendar,
  useDisconnectGoogleCalendar,
  useGoogleCalendarStatus,
} from '@store/GoogleCalendar.store';

const { Title, Text } = Typography;

const GoogleCalendarCard = () => {
  const { data: status, isLoading } = useGoogleCalendarStatus();
  const { mutate: connect, isPending: connecting } = useConnectGoogleCalendar();
  const { mutate: disconnect, isPending: disconnecting } =
    useDisconnectGoogleCalendar();

  return (
    <div className="max-w-md">
      <Title level={4} className="mt-0!">
        Integrações
      </Title>
      <Text type="secondary">
        Conecte sua Google Agenda para que novos agendamentos sejam criados
        automaticamente nela.
      </Text>

      <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <Text strong>Google Agenda</Text>

            {isLoading ? (
              <Spin size="small" className="mt-1 self-start" />
            ) : status?.connected ? (
              <Text type="secondary" className="truncate text-xs!">
                {status.googleEmail ?? 'Conectada'}
                {status.connectedAt &&
                  ` · desde ${dayjs(status.connectedAt).format('DD/MM/YYYY')}`}
              </Text>
            ) : (
              <Text type="secondary" className="text-xs!">
                Não conectada
              </Text>
            )}
          </div>

          {!isLoading &&
            (status?.connected ? (
              <div className="flex items-center gap-2">
                <Tag color="green">Conectada</Tag>
                <Popconfirm
                  title="Desconectar a Google Agenda?"
                  okText="Desconectar"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => disconnect()}
                >
                  <Button danger loading={disconnecting}>
                    Desconectar
                  </Button>
                </Popconfirm>
              </div>
            ) : (
              <Button
                type="primary"
                loading={connecting}
                onClick={() => connect()}
              >
                Conectar
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarCard;
