import { z } from 'zod';

export type TSignInForm = z.infer<typeof signInSchema>;

export const signInSchema = z.object({
  email: z.email('E-mail é inválido!').trim(),
  password: z.string().nonempty('Senha é obrigatória'),
});
