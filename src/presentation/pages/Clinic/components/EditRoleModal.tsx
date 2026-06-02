import { useEffect, useMemo, useState } from 'react';

import { Button, Divider, Modal, Switch, Tag, Typography } from 'antd';

import { USER_ROLES } from '@constants/USER_ROLES';
import { ROLE_COLORS } from '@constants/ROLE_COLORS';

import { translateRole } from '@functions/translateRole';

import type { TClinicUser, TPermissionCatalog } from '@store/ClinicStore';

const { Title, Text } = Typography;

type TRole = keyof typeof USER_ROLES;

type TPermission = { key: string; label: string };

const ROLE_TAGS: TRole[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.RECEPTION,
  USER_ROLES.PROFESSIONAL,
  USER_ROLES.CUSTOM,
];

const CATEGORY_LABELS: Record<string, string> = {
  PATIENT: 'Pacientes',
  APPOINTMENT: 'Agendamentos',
  CONSULT: 'Consultas',
  CLINIC: 'Clínica',
};

const groupByCategory = (permissions: TPermission[]) => {
  const groups: { key: string; label: string; permissions: TPermission[] }[] =
    [];

  for (const permission of permissions) {
    const prefix = permission.key.split('_')[0];

    let group = groups.find((g) => g.key === prefix);

    if (!group) {
      group = {
        key: prefix,
        label: CATEGORY_LABELS[prefix] ?? prefix,
        permissions: [],
      };
      groups.push(group);
    }

    group.permissions.push(permission);
  }

  return groups;
};

type TEditRoleModalProps = {
  pending: boolean;
  open: boolean;
  user: TClinicUser | null;
  catalog?: TPermissionCatalog;
  onClose: () => void;
  onSubmitRole: (role: TRole) => void;
  onSubmitPermissions: (permissions: string[]) => void;
};

const EditRoleModal: React.FC<TEditRoleModalProps> = (props) => {
  const {
    pending,
    open,
    user,
    catalog,
    onClose,
    onSubmitRole,
    onSubmitPermissions,
  } = props;

  const [selectedRole, setSelectedRole] = useState<TRole>(USER_ROLES.CUSTOM);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (open && user) {
      setSelectedRole(user.role);
      setSelectedPermissions(user.permissions ?? []);
    }
  }, [open, user]);

  const isCustom = selectedRole === USER_ROLES.CUSTOM;

  const categories = useMemo(
    () => groupByCategory(catalog?.permissions ?? []),
    [catalog],
  );

  const handleSelectRole = (role: TRole) => {
    if (pending) return;

    setSelectedRole(role);

    if (role !== USER_ROLES.CUSTOM) {
      setSelectedPermissions(catalog?.presets[role] ?? []);
    }
  };

  const togglePermission = (key: string, checked: boolean) => {
    setSelectedRole(USER_ROLES.CUSTOM);
    setSelectedPermissions((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key),
    );
  };

  const handleSave = () => {
    if (!user) return;

    if (isCustom) {
      onSubmitPermissions(selectedPermissions);
    } else {
      onSubmitRole(selectedRole);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Title level={4} className="my-0!">
        {user?.name}
      </Title>

      <Text type="secondary">Alteração de permissão</Text>

      <Divider className="my-3!" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {ROLE_TAGS.map((role) => {
            const active = selectedRole === role;

            return (
              <Tag
                key={role}
                color={active ? ROLE_COLORS[role] : undefined}
                variant={active ? 'solid' : 'outlined'}
                onClick={() => handleSelectRole(role)}
                className="m-0! cursor-pointer px-3 py-1 text-sm select-none"
              >
                {translateRole(role)}
              </Tag>
            );
          })}
        </div>

        <div
          className={`flex max-h-72 flex-col gap-4 overflow-y-auto pr-1 transition-all ${
            isCustom ? '' : 'grayscale-40'
          }`}
        >
          {categories.map((category) => (
            <div key={category.key}>
              <Text
                strong
                className="text-xs! tracking-wide text-gray-400! uppercase"
              >
                {category.label}
              </Text>

              <div className="mt-2 flex flex-col gap-2">
                {category.permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm">{permission.label}</span>

                    <Switch
                      size="small"
                      disabled={pending}
                      checked={selectedPermissions.includes(permission.key)}
                      onChange={(checked) =>
                        togglePermission(permission.key, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          disabled={pending}
          loading={pending}
          type="primary"
          onClick={handleSave}
          className="self-end"
        >
          Salvar
        </Button>
      </div>
    </Modal>
  );
};

export default EditRoleModal;
