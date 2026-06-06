import type { USER_ROLES } from '@constants/USER_ROLES';

export type TUser = {
  id: string;
  name: string;
};

export type TClinic = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
};

export type TClinicProfile = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  role: keyof typeof USER_ROLES;
  clinic: TClinic;
};

export interface TAuthStore {
  accessToken: string;
  user: TUser;
  userClinics: TClinicProfile[];
  clinicProfile?: TClinicProfile;
}

export type TAuthLoginPayload = { email: string; password: string };

export type TAuthResponse = {
  accessToken: string;
  userClinics: TClinicProfile[];
  user: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    role: string;
  };
};

export type TAuthCompleteRegistrationPayload = { token: string; password: string };

export type TAuthRegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthdate?: Date;
};

export type TAuthForgotPasswordPayload = { email: string };

export type TAuthResetPasswordPayload = { token: string; password: string };

export type TClinicCreatePayload = {
  name: string;
  specialty: string;
  addressZip: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string;
  addressDistrict: string;
  addressCity: string;
  addressState: string;
};

export type TAuthMeResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userClinics: TClinicProfile[];
};
