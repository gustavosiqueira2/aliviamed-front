import { useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import { Button, Card, Descriptions, Empty, Spin, Tag, Typography } from 'antd';
import { ArrowLeft } from 'lucide-react';

import type { USER_ROLES } from '@constants/USER_ROLES';
import { ROLE_COLORS } from '@constants/ROLE_COLORS';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import { formatCurrency } from '@functions/formatCurrency';
import { translateRole } from '@functions/translateRole';
import { getApiError } from '@functions/getApiError';

import type { TClinicUserStatus } from '@interfaces/Clinic.interface';
import { useNotificationContext } from '@contexts/NotificationContext';

import {
  useArchiveUser,
  useChangeUserPermissions,
  useChangeUserRole,
  useChangeUserStatus,
  useClinic,
  usePermissionCatalog,
  useUnarchiveUser,
  useUpdateUserPrices,
} from '@store/Clinic.store';
import { useAuth } from '@store/Auth.store';

import { usePermissions } from '@hooks/usePermissions';

import FadeWrapper from '@components/FadeWrapper';
import Can from '@components/Can/Can';

import type { TPricesSubmit } from './components/EditPricesModal';
import EditPricesModal from './components/EditPricesModal';
import EditRoleModal from './components/EditRoleModal';

const { Title, Text } = Typography;

const renderStatusTag = (status: TClinicUserStatus) => {
  if (status === 'PENDING') return <Tag color="orange">Pendente</Tag>;

  if (status === 'ARCHIVED') {
    return (
      <Tag color="default" variant="outlined">
        Arquivado
      </Tag>
    );
  }

  const active = status === 'ACTIVE';

  return (
    <Tag color={active ? 'blue' : ''} variant="outlined">
      {active ? 'Ativo' : 'Desativado'}
    </Tag>
  );
};

const formatPrice = (value: number | null) =>
  value === null ? '—' : formatCurrency(value);

const ClinicUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const { notify } = useNotificationContext();

  const { data: auth } = useAuth();
  const { data: clinic, isLoading } = useClinic();
  const { data: permissionCatalog } = usePermissionCatalog();
  const { hasPermission } = usePermissions();

  const [showEditRole, setShowEditRole] = useState(false);
  const [showEditPrices, setShowEditPrices] = useState(false);

  const { mutateAsync: changeUserStatus, isPending: isPendingChangeStatus } =
    useChangeUserStatus();
  const { mutateAsync: archiveUser, isPending: isPendingArchive } =
    useArchiveUser();
  const { mutateAsync: unarchiveUser, isPending: isPendingUnarchive } =
    useUnarchiveUser();
  const { mutateAsync: changeUserRole, isPending: isPendingChangeRole } =
    useChangeUserRole();
  const {
    mutateAsync: changeUserPermissions,
    isPending: isPendingChangePermissions,
  } = useChangeUserPermissions();
  const { mutateAsync: updateUserPrices, isPending: isPendingUpdatePrices } =
    useUpdateUserPrices();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const user = clinic?.participants.find((p) => p.userId === userId);

  if (!user) {
    return (
      <FadeWrapper className="flex flex-col items-center justify-center gap-4">
        <Empty description="Colaborador não encontrado." />
        <Button onClick={() => navigate(ROUTE_NAMES.CLINIC)}>Voltar</Button>
      </FadeWrapper>
    );
  }

  const isSelf = user.userId === auth?.user.id;

  const canEditPrices =
    isSelf || hasPermission(PERMISSIONS.CLINIC_USER_PRICE_MANAGE);

  const onError = (err: unknown) =>
    notify({
      type: 'error',
      title: 'Houve um problema',
      description: getApiError(err),
    });

  const handleChangeStatus = async (status: boolean) => {
    try {
      await changeUserStatus({ id: user.userId, status });
      notify({
        type: 'success',
        title: 'Sucesso',
        description: `O colaborador foi ${status ? 'ativado' : 'desativado'}!`,
      });
    } catch (err) {
      onError(err);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveUser(user.userId);
      notify({
        type: 'success',
        title: 'Sucesso',
        description: 'O colaborador foi arquivado!',
      });
    } catch (err) {
      onError(err);
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveUser(user.userId);
      notify({
        type: 'success',
        title: 'Sucesso',
        description: 'O colaborador foi desarquivado!',
      });
    } catch (err) {
      onError(err);
    }
  };

  const handleChangeRole = async (role: keyof typeof USER_ROLES) => {
    try {
      await changeUserRole({ id: user.userId, role });
      notify({
        type: 'success',
        title: 'Sucesso',
        description: `A função de ${user.name} foi atualizada!`,
      });
      setShowEditRole(false);
    } catch (err) {
      onError(err);
    }
  };

  const handleChangePermissions = async (permissions: string[]) => {
    try {
      await changeUserPermissions({ id: user.userId, permissions });
      notify({
        type: 'success',
        title: 'Sucesso',
        description: `As permissões de ${user.name} foram atualizadas!`,
      });
      setShowEditRole(false);
    } catch (err) {
      onError(err);
    }
  };

  const handleUpdatePrices = async (prices: TPricesSubmit) => {
    try {
      await updateUserPrices({ id: user.userId, ...prices });
      notify({
        type: 'success',
        title: 'Sucesso',
        description: `Os valores de ${user.name} foram atualizados!`,
      });
      setShowEditPrices(false);
    } catch (err) {
      onError(err);
    }
  };

  const permissionLabels = new Map(
    (permissionCatalog?.permissions ?? []).map((p) => [p.key, p.label]),
  );

  return (
    <FadeWrapper className="flex flex-col gap-4">
      <EditRoleModal
        pending={isPendingChangeRole || isPendingChangePermissions}
        open={showEditRole}
        user={user}
        catalog={permissionCatalog}
        onClose={() => setShowEditRole(false)}
        onSubmitRole={handleChangeRole}
        onSubmitPermissions={handleChangePermissions}
      />

      <EditPricesModal
        pending={isPendingUpdatePrices}
        open={showEditPrices}
        user={user}
        onClose={() => setShowEditPrices(false)}
        onSubmit={handleUpdatePrices}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="text"
            shape="circle"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(ROUTE_NAMES.CLINIC)}
          />
          <Title level={2} className="mb-0!">
            {user.name}
          </Title>
          {renderStatusTag(user.status)}
        </div>

        {!isSelf && (
          <Can permission={PERMISSIONS.CLINIC_USER_MANAGE}>
            <div className="flex gap-2">
              {user.status === 'INACTIVE' && (
                <Button
                  danger
                  type="dashed"
                  disabled={isPendingArchive}
                  onClick={handleArchive}
                >
                  Arquivar
                </Button>
              )}
              {user.status === 'ACTIVE' && (
                <Button
                  disabled={isPendingChangeStatus}
                  onClick={() => handleChangeStatus(false)}
                >
                  Desativar
                </Button>
              )}
              {user.status === 'INACTIVE' && (
                <Button
                  disabled={isPendingChangeStatus}
                  onClick={() => handleChangeStatus(true)}
                >
                  Ativar
                </Button>
              )}
              {user.status === 'ARCHIVED' && (
                <Button disabled={isPendingUnarchive} onClick={handleUnarchive}>
                  Desarquivar
                </Button>
              )}
              {user.status !== 'ARCHIVED' && (
                <Button type="primary" onClick={() => setShowEditRole(true)}>
                  Editar permissão
                </Button>
              )}
            </div>
          </Can>
        )}
      </div>

      <Card title="Dados do colaborador">
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
          <Descriptions.Item label="Nome">{user.name}</Descriptions.Item>
          <Descriptions.Item label="E-mail">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Função">
            <Tag variant="outlined" color={ROLE_COLORS[user.role]}>
              {translateRole(user.role)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Especialidade">
            {user.specialty || '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {renderStatusTag(user.status)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Valores de consulta"
        extra={
          canEditPrices && (
            <Button
              type="primary"
              size="small"
              onClick={() => setShowEditPrices(true)}
            >
              Editar valores
            </Button>
          )
        }
      >
        <Descriptions column={{ xs: 1, sm: 3 }} bordered size="small">
          <Descriptions.Item label="Padrão">
            {formatPrice(user.defaultAppointmentPrice)}
          </Descriptions.Item>
          <Descriptions.Item label="Retorno">
            {formatPrice(user.returnAppointmentPrice)}
          </Descriptions.Item>
          <Descriptions.Item label="Urgência">
            {formatPrice(user.urgentAppointmentPrice)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Permissões">
        {user.permissions.length === 0 ? (
          <Text type="secondary">Nenhuma permissão.</Text>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((perm) => (
              <Tag key={perm} variant="outlined">
                {permissionLabels.get(perm) ?? perm}
              </Tag>
            ))}
          </div>
        )}
      </Card>
    </FadeWrapper>
  );
};

export default ClinicUser;
