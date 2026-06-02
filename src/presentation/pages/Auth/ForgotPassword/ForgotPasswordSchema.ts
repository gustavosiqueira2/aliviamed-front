import { z } from 'zod';

export type TForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Email é obrigatório'),
});
