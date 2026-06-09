import { useState } from 'react';

import { Button } from 'antd';

import { PERMISSIONS } from '@constants/PERMISSIONS';

import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import { usePayFinancialEntry } from '@store/Financial.store';
import type { TCashFlowEntry } from '@interfaces/Financial.interface';

import { usePermissions } from '@hooks/usePermissions';

import PaymentModal, {
  type TPaymentSubmit,
} from '@components/Modal/PaymentModal';

type TPayEntryButtonProps = {
  entry: TCashFlowEntry;
};

const PayEntryButton: React.FC<TPayEntryButtonProps> = ({ entry }) => {
  const { notify } = useNotificationContext();
  const { hasPermission } = usePermissions();
  const { mutateAsync: pay, isPending } = usePayFinancialEntry();

  const [open, setOpen] = useState(false);

  const handlePay = async ({ paymentMethod, paidAt }: TPaymentSubmit) => {
    try {
      await pay({ id: entry.id, paymentMethod, paidAt });

      notify({
        type: 'success',
        title: 'Sucesso!',
        description: 'Pagamento registrado',
      });

      setOpen(false);
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema!',
        description: getApiError(err, 'Não foi possível registrar o pagamento'),
      });
    }
  };

  if (entry.status !== 'PENDING' || !hasPermission(PERMISSIONS.FINANCIAL_UPDATE)) {
    return null;
  }

  return (
    <>
      <Button type="primary" size="small" onClick={() => setOpen(true)}>
        Pagar
      </Button>

      <PaymentModal
        open={open}
        pending={isPending}
        amount={entry.amount}
        patientName={entry.patientName ?? undefined}
        onClose={() => setOpen(false)}
        onSubmit={handlePay}
      />
    </>
  );
};

export default PayEntryButton;
