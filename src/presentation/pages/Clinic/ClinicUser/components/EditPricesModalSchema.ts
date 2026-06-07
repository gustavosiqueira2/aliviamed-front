import { z } from 'zod';

export type TEditPricesForm = z.infer<typeof EditPricesSchema>;

export const EditPricesSchema = z.object({
  defaultAppointmentPrice: z
    .number('Valor inválido')
    .min(0, 'Valor não pode ser negativo')
    .nullable(),
  returnAppointmentPrice: z
    .number('Valor inválido')
    .min(0, 'Valor não pode ser negativo')
    .nullable(),
  urgentAppointmentPrice: z
    .number('Valor inválido')
    .min(0, 'Valor não pode ser negativo')
    .nullable(),
});
