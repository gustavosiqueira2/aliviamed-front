import { USER_ROLES } from '@constants/USER_ROLES';

export const translateRole = (role: keyof typeof USER_ROLES) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Administrador';
    case USER_ROLES.PROFESSIONAL:
      return 'Profissional';
    case USER_ROLES.RECEPTION:
      return 'Recepcionista';
    case USER_ROLES.CUSTOM:
      return 'Personalizado';
  }
};
