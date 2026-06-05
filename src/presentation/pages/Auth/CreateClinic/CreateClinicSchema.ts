import { z } from 'zod';

export type TCreateClinicForm = z.infer<typeof createClinicSchema>;

export const createClinicSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  specialty: z.string().trim().min(1, 'Especialidade é obrigatória'),
  addressZip: z.string().trim().min(8, 'CEP é obrigatório'),
  addressStreet: z.string().trim().min(1, 'Logradouro é obrigatório'),
  addressNumber: z.string().trim().min(1, 'Número é obrigatório'),
  addressComplement: z.string().trim().optional(),
  addressDistrict: z.string().trim().min(1, 'Bairro é obrigatório'),
  addressCity: z.string().trim().min(1, 'Cidade é obrigatória'),
  addressState: z.string().trim().min(1, 'UF é obrigatória'),
});
