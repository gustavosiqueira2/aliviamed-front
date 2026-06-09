import { useEffect } from 'react';

import dayjs from 'dayjs';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Modal, Typography } from 'antd';

import MoneyInput from '@components/Form/MoneyInput';
import SelectInput from '@components/Form/SelectInput';
import DateInput from '@components/Form/DateInput';

import {
  PaymentSchema,
  PAYMENT_METHOD_OPTIONS,
  type TPaymentForm,
} from './PaymentModalSchema';

const { Title, Text } = Typography;

export type TPaymentSubmit = {
  paymentMethod: string;
  paidAt: string;
};

type TPaymentModalProps = {
  open: boolean;
  pending: boolean;
  amount: number;
  patientName?: string;
  onClose: () => void;
  onSubmit: (data: TPaymentSubmit) => void;
};

const PaymentModal: React.FC<TPaymentModalProps> = (props) => {
  const { open, pending, amount, patientName, onClose, onSubmit } = props;

  const { control, handleSubmit, reset } = useForm<TPaymentForm>({
    resolver: zodResolver(PaymentSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        amount,
        paymentMethod: undefined,
        paidAt: new Date(),
      });
    }
  }, [open, amount, reset]);

  const handleSave = (data: TPaymentForm) => {
    onSubmit({
      paymentMethod: data.paymentMethod,
      paidAt: dayjs(data.paidAt).toISOString(),
    });
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Title level={4} className="my-0!">
        Executar pagamento
      </Title>
      {patientName && <Text type="secondary">{patientName}</Text>}

      <form onSubmit={handleSubmit(handleSave)}>
        <div className="mt-4 flex flex-col gap-3">
          <MoneyInput control={control} name="amount" label="Valor" disabled />
          <SelectInput
            control={control}
            name="paymentMethod"
            label="Forma de pagamento"
            placeholder="Selecione"
            options={PAYMENT_METHOD_OPTIONS}
            disabled={pending}
          />
          <DateInput
            control={control}
            name="paidAt"
            label="Data do pagamento"
            disabled={pending}
            disabledDate={(current) => current.isAfter(dayjs(), 'day')}
          />

          <Button
            type="primary"
            htmlType="submit"
            className="self-end"
            loading={pending}
            disabled={pending}
          >
            Confirmar pagamento
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
