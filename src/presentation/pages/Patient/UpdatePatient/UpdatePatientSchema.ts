import { z } from 'zod';

export type TUpdatePatientForm = z.infer<typeof UpdatePatientSchema>;

export const UpdatePatientSchema = z.object({
  name: z.string('O nome é obrigatório').trim(),
  birthdate: z
    .date('Data de nascimento é obrigatória')
    .max(new Date(), 'Data de nascimento não pode ser no futuro'),
});
