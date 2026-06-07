import { useState } from 'react';

import { useNavigate } from 'react-router';

import { Button, Card, Table, Tag, Typography } from 'antd';

import { translateRole } from '@functions/translateRole';
import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import { ROLE_COLORS } from '@constants/ROLE_COLORS';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import { useAddCollaborator, useClinic } from '@store/Clinic.store';
import type { TClinicUser } from '@interfaces/Clinic.interface';

import FadeWrapper from '@components/FadeWrapper';
import Can from '@components/Can/Can';

import type { TManualAdditionSchemaForm } from './components/ManualAdditionSchema';
import AddCollaboratorModal from './components/AddCollaboratorModal';

const { Title } = Typography;

const Clinic = () => {
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const { data: clinic } = useClinic();

  const [showAddCollaboratorModal, setShowAddCollaboratorModal] =
    useState(false);

  const { mutateAsync: addCollaborator, isPending: isPendingAddCollaborator } =
    useAddCollaborator();

  if (!clinic) return;

  const handleManualAddition = async (data: TManualAdditionSchemaForm) => {
    try {
      await addCollaborator(data);

      notify({
        type: 'success',
        title: 'Sucesso',
        description: `${data.name} foi convidado(a) para a sua clínica, um convite foi enviado por e-mail para ele(a)!`,
      });
      setShowAddCollaboratorModal(false);
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema',
        description: getApiError(err),
      });
    }
  };

  return (
    <FadeWrapper>
      <AddCollaboratorModal
        pending={isPendingAddCollaborator}
        open={showAddCollaboratorModal}
        onClose={() => setShowAddCollaboratorModal(false)}
        onManualAddition={handleManualAddition}
      />

      <div className="mb-3 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          Clinica - {clinic.name}
        </Title>

        <Can permission={PERMISSIONS.CLINIC_USER_MANAGE}>
          <Button
            type="primary"
            onClick={() => setShowAddCollaboratorModal(true)}
          >
            Adicionar colaborador
          </Button>
        </Can>
      </div>

      <Card variant="borderless" classNames={{ body: 'p-0!' }}>
        <Table
          dataSource={clinic.participants || []}
          rowKey="userId"
          columns={[
            {
              title: 'Status',
              align: 'center',
              className: 'w-0',
              render: (v: TClinicUser) => {
                if (v.status === 'PENDING') {
                  return <Tag color="orange">Pendente</Tag>;
                }

                if (v.status === 'ARCHIVED') {
                  return (
                    <Tag color="default" variant="outlined">
                      Arquivado
                    </Tag>
                  );
                }

                const active = v.status === 'ACTIVE';

                return (
                  <Tag color={active ? 'blue' : ''} variant="outlined">
                    {active ? 'Ativo' : 'Desativado'}
                  </Tag>
                );
              },
            },
            { title: 'Nome', dataIndex: 'name' },
            { title: 'Email', dataIndex: 'email' },
            {
              title: 'Permissão',
              render: ({ role }: TClinicUser) => (
                <Tag variant="outlined" color={ROLE_COLORS[role]}>
                  {translateRole(role)}
                </Tag>
              ),
            },
            {
              render: (v: TClinicUser) => (
                <div className="flex justify-end">
                  <Button
                    onClick={() =>
                      navigate(`${ROUTE_NAMES.CLINIC}/${v.userId}`)
                    }
                  >
                    Detalhes
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </FadeWrapper>
  );
};

export default Clinic;
