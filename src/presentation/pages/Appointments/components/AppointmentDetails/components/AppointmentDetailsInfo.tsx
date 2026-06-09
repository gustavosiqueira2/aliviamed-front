import { useState } from 'react';

import dayjs from 'dayjs';

import { Button, Tag, theme, Typography } from 'antd';

import { PERMISSIONS } from '@constants/PERMISSIONS';

import { formatCurrency } from '@functions/formatCurrency';
import { getApiError } from '@functions/getApiError';
import { getPaymentStatusTag } from '@functions/getPaymentStatusTag';

import { useNotificationContext } from '@contexts/NotificationContext';

import {
  usePaymentByAppointment,
  usePayFinancialEntry,
} from '@store/Financial.store';
import type { TAppointment } from '@interfaces/Appointment.interface';

import { usePermissions } from '@hooks/usePermissions';

import Can from '@components/Can/Can';
import PaymentModal, {
  type TPaymentSubmit,
} from '@components/Modal/PaymentModal';

const { Text } = Typography;

type TAppointmentDetailsInfoProps = {
  appointment: TAppointment;
  patientName?: string;
};

const AppointmentDetailsInfo: React.FC<TAppointmentDetailsInfoProps> = (
  props,
) => {
  const { appointment, patientName } = props;

  const {
    token: { colorTextDisabled },
  } = theme.useToken();

  const { notify } = useNotificationContext();

  const { hasPermission } = usePermissions();
  const canView = hasPermission(PERMISSIONS.FINANCIAL_VIEW);

  const { data: payment } = usePaymentByAppointment(
    canView ? appointment.id : undefined,
  );

  const { mutateAsync: pay, isPending } = usePayFinancialEntry();

  const [isPaying, setIsPaying] = useState(false);

  const handlePay = async ({ paymentMethod, paidAt }: TPaymentSubmit) => {
    if (!payment) return;

    try {
      await pay({ id: payment.id, paymentMethod, paidAt });

      notify({
        type: 'success',
        title: 'Sucesso!',
        description: 'Pagamento registrado',
      });

      setIsPaying(false);
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema!',
        description: getApiError(err, 'Não foi possível registrar o pagamento'),
      });
    }
  };

  if (!canView || (!payment && appointment.price == null)) return null;

  const statusTag =
    payment && getPaymentStatusTag(payment.status, payment.dueAt);

  const subtitle = payment
    ? [
        payment.paymentMethod,
        payment.paidAt && `pago em ${dayjs(payment.paidAt).format('DD/MM')}`,
      ]
        .filter(Boolean)
        .join(' · ') || 'Pagamento'
    : 'Valor previsto';

  return (
    <div
      style={{ borderColor: colorTextDisabled }}
      className="mt-1 rounded-xl border p-2"
    >
      <div className="flex items-start justify-between gap-2 px-1">
        <div className="flex min-w-0 flex-col">
          <Text type="secondary" className="text-xs!">
            {subtitle}
          </Text>
          <Text className="text-base! font-semibold!">
            {formatCurrency(payment ? payment.amount : appointment.price!)}
          </Text>
        </div>

        {statusTag && (
          <Tag
            variant="outlined"
            color={statusTag.color}
            className="rounded-lg!"
          >
            {statusTag.label}
          </Tag>
        )}
      </div>

      {payment?.status === 'PENDING' && (
        <Can permission={PERMISSIONS.FINANCIAL_UPDATE}>
          <Button
            type="primary"
            size="small"
            className="mt-1"
            block
            onClick={() => setIsPaying(true)}
          >
            Executar pagamento
          </Button>
        </Can>
      )}

      <PaymentModal
        open={isPaying}
        pending={isPending}
        amount={payment?.amount ?? 0}
        patientName={patientName}
        onClose={() => setIsPaying(false)}
        onSubmit={handlePay}
      />
    </div>
  );
};

export default AppointmentDetailsInfo;
