import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Modal, Typography } from 'antd';

import type { TClinicUser } from '@interfaces/Clinic.interface';

import MoneyInput from '@components/Form/MoneyInput';

import {
  EditPricesSchema,
  type TEditPricesForm,
} from './EditPricesModalSchema';

const { Title, Text } = Typography;

export type TPricesSubmit = {
  defaultAppointmentPrice?: number;
  returnAppointmentPrice?: number;
  urgentAppointmentPrice?: number;
};

type TEditPricesModalProps = {
  open: boolean;
  pending: boolean;
  user: TClinicUser | null;
  onClose: () => void;
  onSubmit: (prices: TPricesSubmit) => void;
};

const clean = (value: number | null) => (value === null ? undefined : value);

const EditPricesModal: React.FC<TEditPricesModalProps> = (props) => {
  const { open, pending, user, onClose, onSubmit } = props;

  const { control, handleSubmit, reset } = useForm<TEditPricesForm>({
    resolver: zodResolver(EditPricesSchema),
  });

  useEffect(() => {
    if (open && user) {
      reset({
        defaultAppointmentPrice: user.defaultAppointmentPrice,
        returnAppointmentPrice: user.returnAppointmentPrice,
        urgentAppointmentPrice: user.urgentAppointmentPrice,
      });
    }
  }, [open, user, reset]);

  const handleSave = (data: TEditPricesForm) => {
    onSubmit({
      defaultAppointmentPrice: clean(data.defaultAppointmentPrice),
      returnAppointmentPrice: clean(data.returnAppointmentPrice),
      urgentAppointmentPrice: clean(data.urgentAppointmentPrice),
    });
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Title level={4} className="my-0!">
        {user?.name}
      </Title>
      <Text type="secondary">Valores de consulta</Text>

      <form onSubmit={handleSubmit(handleSave)}>
        <div className="mt-4 flex flex-col gap-3">
          <MoneyInput
            control={control}
            name="defaultAppointmentPrice"
            label="Valor padrão"
            placeholder="Não definido"
            disabled={pending}
          />
          <MoneyInput
            control={control}
            name="returnAppointmentPrice"
            label="Valor de retorno"
            placeholder="Não definido"
            disabled={pending}
          />
          <MoneyInput
            control={control}
            name="urgentAppointmentPrice"
            label="Valor de urgência"
            placeholder="Não definido"
            disabled={pending}
          />

          <Button
            type="primary"
            htmlType="submit"
            className="self-end"
            loading={pending}
            disabled={pending}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPricesModal;
