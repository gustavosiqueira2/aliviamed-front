import { z } from 'zod';

export type RescheduleAppointmentForm = z.infer<
  typeof RescheduleAppointmentSchema
>;

export const RescheduleAppointmentSchema = z.object({
  date: z.date('A Data é obrigatória'),
  startHour: z.string({ error: 'O Horário de inicio é obrigatório' }),
  endHour: z.string({ error: 'O Horário de inicio é obrigatório' }),
});
