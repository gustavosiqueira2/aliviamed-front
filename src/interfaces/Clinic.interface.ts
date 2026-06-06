import type { USER_ROLES } from '@constants/USER_ROLES';

export type TClinicUser = {
  userId: string;
  name: string;
  email: string;
  role: keyof typeof USER_ROLES;
  permissions: string[];
  active: boolean;
};

export type TClinicResponse = {
  name: string;
  participants: TClinicUser[];
};

export type TClinicAddCollaboratorPayload = {
  name: string;
  email: string;
  role: keyof typeof USER_ROLES;
  specialty?: string;
};

export type TClinicChangeUserStatusPayload = {
  id: string;
  status: boolean;
};

export type TClinicChangeUserRolePayload = {
  id: string;
  role: keyof typeof USER_ROLES;
};

export type TClinicChangeUserPermissionsPayload = {
  id: string;
  permissions: string[];
};

export type TClinicPermissionCatalog = {
  permissions: { key: string; label: string }[];
  presets: Partial<Record<keyof typeof USER_ROLES, string[]>>;
};

export type TClinicSearchProfessionalResponse = {
  id: string;
  name: string;
}[];
