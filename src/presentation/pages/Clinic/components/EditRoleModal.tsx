import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { Button, Divider, Modal, Typography } from 'antd';

import { USER_ROLES } from '@constants/USER_ROLES';

import { translateRole } from '@functions/translateRole';

import SelectInput from '@components/Form/SelectInput';

import type { TClinicUser } from '@store/ClinicStore';

const { Title, Text } = Typography;

type TEditRoleForm = {
  role: keyof typeof USER_ROLES;
};

type TEditRoleModalProps = {
  pending: boolean;
  open: boolean;
  user: TClinicUser | null;
  onClose: () => void;
  onSubmit: (role: keyof typeof USER_ROLES) => void;
};

const EditRoleModal: React.FC<TEditRoleModalProps> = (props) => {
  const { pending, open, user, onClose, onSubmit } = props;

  const { control, handleSubmit, reset } = useForm<TEditRoleForm>();

  useEffect(() => {
    if (open && user) {
      reset({ role: user.role });
    }
  }, [open, user, reset]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Title level={4} className="my-0!">
        {user?.name}
      </Title>

      <Text type="secondary">Altere as permissões deste colaborador</Text>

      <Divider className="my-2!" />

      <form onSubmit={handleSubmit((data) => onSubmit(data.role))}>
        <div className="flex flex-col gap-4">
          <SelectInput
            disabled={pending}
            label="Permissão"
            control={control}
            name="role"
            options={[
              {
                label: translateRole(USER_ROLES.ADMIN),
                value: USER_ROLES.ADMIN,
              },
              {
                label: translateRole(USER_ROLES.RECEPTION),
                value: USER_ROLES.RECEPTION,
              },
              {
                label: translateRole(USER_ROLES.PROFESSIONAL),
                value: USER_ROLES.PROFESSIONAL,
              },
            ]}
          />

          <Button
            disabled={pending}
            type="primary"
            htmlType="submit"
            className="self-end"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoleModal;
