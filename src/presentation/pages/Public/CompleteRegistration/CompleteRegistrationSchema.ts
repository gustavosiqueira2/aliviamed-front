import { z } from 'zod';

export type TCompleteRegistrationForm = z.infer<
  typeof completeRegistrationSchema
>;

export const completeRegistrationSchema = z
  .object({
    password: z
      .string('Senha é obrigatória')
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .regex(/[a-z]/, {
        message: 'A senha deve conter pelo menos uma letra minúscula',
      })
      .regex(/\d/, { message: 'A senha deve conter pelo menos um número' })
      .regex(/[@$!%*?&-]/, {
        message:
          'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &, -)',
      }),
    confirmPassword: z.string('Confirmação de senha é obrigatória'),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas não conferem',
        path: ['confirmPassword'],
      });
    }
  });
