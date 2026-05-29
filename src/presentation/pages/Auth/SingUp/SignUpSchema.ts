import { z } from 'zod';

export type TSignUpForm = z.infer<typeof signUpSchema>;

export const signUpSchema = z
  .object({
    name: z.string('Nome é obrigatório'),
    phone: z.string('Número é obrigatório').regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
      message: 'Número de telefone inválido',
    }),
    email: z.email('Email é obrigatório'),
    birthdate: z
      .date('Data de nascimento é obrigatória')
      .max(new Date(), 'Data de nascimento não pode ser no futuro'),
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
