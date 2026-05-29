import { z } from 'zod';

import { USER_ROLES } from '@constants/USER_ROLES';

const roles = Object.values(USER_ROLES) as [
  (typeof USER_ROLES)[keyof typeof USER_ROLES],
  ...(typeof USER_ROLES)[keyof typeof USER_ROLES][],
];

export type TManualAdditionSchemaForm = z.infer<
  typeof ManualAdditionSchemaSchema
>;

export const ManualAdditionSchemaSchema = z.object({
  email: z.email('E-mail é inválido!').trim(),
  name: z.string('Nome é obrigatório'),
  role: z.enum(roles, {
    message: 'Role inválida',
  }),
});
