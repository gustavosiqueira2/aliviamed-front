import { z } from 'zod';

export type SendFormForm = z.infer<typeof SendFormSchema>;

export const SendFormSchema = z.object({
  professionalId: z
    .string({ error: 'O profissional é obrigatório' })
    .min(1, 'O profissional é obrigatório'),
  patientId: z
    .string({ error: 'O paciente é obrigatório' })
    .min(1, 'O paciente é obrigatório'),
  formId: z
    .string({ error: 'O formulário é obrigatório' })
    .min(1, 'O formulário é obrigatório'),
});
