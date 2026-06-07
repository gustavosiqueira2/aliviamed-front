import { z } from 'zod';

export type CreateAppointmentForm = z.infer<typeof CreateAppointmentSchema>;

export const CreateAppointmentSchema = z.object({
  professionalId: z
    .string({
      error: 'O paciente é obrigatório',
    })
    .min(1, 'O paciente é obrigatório'),
  patientId: z
    .string({
      error: 'O paciente é obrigatório',
    })
    .min(1, 'O paciente é obrigatório'),
  date: z.date('A Data é obrigatória'),
  startHour: z
    .string({
      error: 'O Horário de inicio é obrigatório',
    })
    .min(1, 'O Horário de inicio é obrigatório'),
  endHour: z
    .string({
      error: 'O Horário de fim é obrigatório',
    })
    .min(1, 'O Horário de fim é obrigatório'),
  type: z.enum(['DEFAULT', 'RETURN', 'URGENT']),
  price: z.number().min(0, 'Valor inválido').nullable().optional(),
});
