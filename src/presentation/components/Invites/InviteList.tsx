import { Button, Card, Empty, List, Tag, Typography } from 'antd';
import { Hospital } from 'lucide-react';

import { ROLE_COLORS } from '@constants/ROLE_COLORS';

import { translateRole } from '@functions/translateRole';
import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useAuth } from '@store/Auth.store';
import { useAcceptInvite } from '@store/Clinic.store';

const { Title, Text } = Typography;

const InviteList = () => {
  const { notify } = useNotificationContext();

  const { data } = useAuth();

  const { mutate: accept, isPending, variables } = useAcceptInvite();

  const invites = data?.invites ?? [];

  const onAccept = (clinicId: string) => {
    accept(clinicId, {
      onSuccess: () => {
        notify({
          type: 'success',
          title: 'Convite aceito',
          description: 'Você agora faz parte da clínica.',
        });
      },
      onError: (err) => {
        notify({
          type: 'error',
          title: 'Não foi possível aceitar o convite',
          description: getApiError(err),
        });
      },
    });
  };

  return (
    <Card>
      <div className="flex flex-col gap-1 text-center">
        <Title level={3} className="mb-0!">
          Convites pendentes
        </Title>
        <Text type="secondary">
          {invites.length > 0
            ? 'Aceite um convite para acessar a clínica.'
            : 'Você não tem convites pendentes.'}
        </Text>
      </div>

      {invites.length > 0 ? (
        <List
          className="mt-4"
          dataSource={invites}
          renderItem={(invite) => (
            <List.Item
              actions={[
                <Button
                  key="accept"
                  type="primary"
                  loading={isPending && variables === invite.clinicId}
                  disabled={isPending}
                  onClick={() => onAccept(invite.clinicId)}
                >
                  Aceitar
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Hospital size={20} />}
                title={invite.clinicName}
                description={
                  <Tag color={ROLE_COLORS[invite.role]}>
                    {translateRole(invite.role)}
                  </Tag>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          className="mt-4"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Nenhum convite pendente"
        />
      )}
    </Card>
  );
};

export default InviteList;
