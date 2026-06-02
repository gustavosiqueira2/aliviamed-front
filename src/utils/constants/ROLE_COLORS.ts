import { USER_ROLES } from './USER_ROLES';

export const ROLE_COLORS: Record<keyof typeof USER_ROLES, string> = {
  [USER_ROLES.ADMIN]: 'red',
  [USER_ROLES.RECEPTION]: 'cyan',
  [USER_ROLES.PROFESSIONAL]: 'blue',
  [USER_ROLES.CUSTOM]: 'purple',
};
