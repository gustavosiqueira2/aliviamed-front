import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert, Button, Divider, Modal, theme, Typography } from 'antd';
import { CircleAlert } from 'lucide-react';

import { USER_ROLES } from '@constants/USER_ROLES';

import { translateRole } from '@functions/translateRole';

import SelectInput from '@components/Form/SelectInput';
import TextInput from '@components/Form/TextInput';

import {
  ManualAdditionSchemaSchema,
  type TManualAdditionSchemaForm,
} from './ManualAdditionSchema';

const { Title } = Typography;

type TAddCollaboratorModalProps = {
  pending: boolean;
  open: boolean;
  onClose: () => void;
  onManualAddition: (data: TManualAdditionSchemaForm) => void;
};

const AddCollaboratorModal: React.FC<TAddCollaboratorModalProps> = (props) => {
  const { pending, open, onClose, onManualAddition } = props;

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { control, handleSubmit, reset } = useForm<TManualAdditionSchemaForm>({
    resolver: zodResolver(ManualAdditionSchemaSchema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Title level={4} className="my-0!">
        Adicionar colaborador
      </Title>

      <Divider className="my-2!" />

      <Title level={5}>Adição manual</Title>

      <form onSubmit={handleSubmit(onManualAddition)}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 md:flex-row">
            <TextInput
              disabled={pending}
              label="Nome"
              control={control}
              name="name"
            />
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
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <TextInput
              disabled={pending}
              label="Email"
              control={control}
              name="email"
            />

            <Button
              disabled={pending}
              type="primary"
              htmlType="submit"
              className="self-end"
            >
              Adicionar
            </Button>
          </div>

          <Alert
            className="mt-2!"
            title={
              <div className="flex items-center gap-2">
                <CircleAlert size={16} color={colorPrimary} />

                <span className="text-xs">
                  Ao enviar o colaborador receberá uma{' '}
                  <b style={{ color: colorPrimary }}>confirmação no email</b>
                </span>
              </div>
            }
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddCollaboratorModal;
