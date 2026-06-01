import { useState } from 'react';

import { Button, Card, Table, Tag, Typography } from 'antd';

import { translateRole } from '@functions/translateRole';
import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import type { USER_ROLES } from '@constants/USER_ROLES';

import {
  useAddCollaborator,
  useChangeUserRole,
  useChangeUserStatus,
  useClinic,
  type TClinicUser,
} from '@store/ClinicStore';
import { useAuth } from '@store/AuthStore';

import FadeWrapper from '@components/FadeWrapper';

import type { TManualAdditionSchemaForm } from './components/ManualAdditionSchema';
import AddCollaboratorModal from './components/AddCollaboratorModal';
import EditRoleModal from './components/EditRoleModal';

const { Title } = Typography;

const Clinic = () => {
  const { notify } = useNotificationContext();

  const { data: auth } = useAuth();
  const { data: clinic } = useClinic();

  const [showAddCollaboratorModal, setShowAddCollaboratorModal] =
    useState(false);
  const [editingUser, setEditingUser] = useState<TClinicUser | null>(null);

  const { mutateAsync: addCollaborator, isPending: isPendingAddCollaborator } =
    useAddCollaborator();
  const { mutateAsync: changeUserStatus, isPending: isPendingChangeStatus } =
    useChangeUserStatus();
  const { mutateAsync: changeUserRole, isPending: isPendingChangeRole } =
    useChangeUserRole();

  if (!clinic) return;

  const handleManualAddition = async (data: TManualAdditionSchemaForm) => {
    try {
      await addCollaborator(data);

      notify({
        type: 'success',
        title: 'Sucesso',
        description: `${data.name} foi adicionado(a) a sua clinica, um email de confirmação foi enviado para ele(a)!`,
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

  const handleChangeUserRole = async (role: keyof typeof USER_ROLES) => {
    if (!editingUser) return;

    try {
      await changeUserRole({
        id: editingUser.userId,
        role,
      });

      notify({
        type: 'success',
        title: 'Sucesso',
        description: (
          <span>
            A permissão de <b className="font-semibold">{editingUser.name}</b>{' '}
            foi atualizada!
          </span>
        ),
      });
      setEditingUser(null);
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema',
        description: getApiError(err),
      });
    }
  };

  const handleChangeUserStatus = async (userId: string, status: boolean) => {
    try {
      await changeUserStatus({
        id: userId,
        status,
      });

      notify({
        type: 'success',
        title: 'Sucesso',
        description: (
          <span>
            O usuário foi{' '}
            <b className="font-semibold">{status ? 'ativado' : 'desativado'}</b>
            !
          </span>
        ),
      });
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

      <EditRoleModal
        pending={isPendingChangeRole}
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleChangeUserRole}
      />

      <div className="mb-3 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          Clinica - {clinic.name}
        </Title>

        <Button
          type="primary"
          onClick={() => setShowAddCollaboratorModal(true)}
        >
          Adicionar colaborador
        </Button>
      </div>

      <Card classNames={{ body: 'p-0!' }}>
        <Table
          dataSource={clinic.participants || []}
          rowKey="id"
          columns={[
            {
              title: 'Status',
              align: 'center',
              className: 'w-0',
              render: (v) => (
                <Tag color={v.active ? 'blue' : ''} variant="outlined">
                  {v.active ? 'Ativo' : 'Desativado'}
                </Tag>
              ),
            },
            { title: 'Nome', dataIndex: 'name' },
            { title: 'Email', dataIndex: 'email' },
            {
              title: 'Permissão',
              render: ({ role }: TClinicUser) => (
                <Tag
                  variant="outlined"
                  color={
                    role === 'ADMIN'
                      ? 'red'
                      : role === 'PROFESSIONAL'
                        ? 'blue'
                        : 'cyan'
                  }
                >
                  {translateRole(role)}
                </Tag>
              ),
            },
            {
              render: (v) => (
                <div className="flex justify-end gap-2">
                  {v.userId !== auth?.user.id && (
                    <Button
                      disabled={isPendingChangeStatus}
                      className="w-26"
                      onClick={() =>
                        handleChangeUserStatus(v.userId, !v.active)
                      }
                    >
                      {v.active ? 'Desativar' : 'Ativar'}
                    </Button>
                  )}
                  {v.userId !== auth?.user.id && (
                    <Button type="primary" onClick={() => setEditingUser(v)}>
                      Editar permissão
                    </Button>
                  )}
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
