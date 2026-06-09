import { z } from 'zod';

export const PAYMENT_METHODS = [
  'PIX',
  'Dinheiro',
  'Cartão de crédito',
  'Cartão de débito',
  'Transferência',
] as const;

export const PAYMENT_METHOD_OPTIONS = PAYMENT_METHODS.map((method) => ({
  label: method,
  value: method,
}));

export type TPaymentForm = z.infer<typeof PaymentSchema>;

export const PaymentSchema = z.object({
  amount: z.number().min(0),
  paymentMethod: z.enum(PAYMENT_METHODS, 'Selecione a forma de pagamento'),
  paidAt: z.date('Data inválida'),
});
