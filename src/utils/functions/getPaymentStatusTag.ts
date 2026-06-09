import dayjs from 'dayjs';

import type { TCashFlowStatus } from '@interfaces/Financial.interface';

const STATUS_TAG: Record<TCashFlowStatus, { color: string; label: string }> = {
  PAID: { color: 'blue', label: 'Pago' },
  PENDING: { color: 'gold', label: 'Pendente' },
  CANCELED: { color: 'default', label: 'Cancelado' },
};

export const getPaymentStatusTag = (
  status: TCashFlowStatus,
  dueAt: Date | null,
): { color: string; label: string } => {
  const overdue =
    status === 'PENDING' && dueAt !== null && dayjs(dueAt).isBefore(dayjs());

  return overdue ? { color: 'red', label: 'Vencido' } : STATUS_TAG[status];
};
