import { useMutation, useQuery } from '@tanstack/react-query';

import type { USER_ROLES } from '@constants/USER_ROLES';
import {
  LOCAL_STORAGE_CLINIC_ID,
  LOCAL_STORAGE_TOKEN_KEY,
} from '@constants/LOCAL_STORAGE_KEYS';

import api from '../../services/api';

import { queryClient } from './QueryClient';

type TUser = {
  id: string;
  name: string;
};

type TClinic = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
};

type TClinicProfile = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  role: keyof typeof USER_ROLES;
  clinic: TClinic;
};

interface IAuthStore {
  accessToken: string;
  user: TUser;
  userClinics: TClinicProfile[];
  clinicProfile?: TClinicProfile;
}

export const useAuthUser = () =>
  useMutation({
    mutationFn: authUser,
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: ['AUTH'],
        },
        data,
      );
    },
  });

type TAuthPayload = { email: string; password: string };

type TApiResponse = {
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

const authUser = async ({
  email,
  password,
}: TAuthPayload): Promise<IAuthStore> => {
  const { data } = await api.post<TApiResponse>('/auth/login', {
    email,
    password,
  });

  window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.accessToken);

  if (data.userClinics.length > 0) {
    window.localStorage.setItem(
      LOCAL_STORAGE_CLINIC_ID,
      data.userClinics[0].clinic.id,
    );
  }

  return { ...data, clinicProfile: data.userClinics[0] };
};

type TCompleteRegistrationPayload = { token: string; password: string };

const completeRegistration = async ({
  token,
  password,
}: TCompleteRegistrationPayload): Promise<IAuthStore> => {
  const { data } = await api.post<TApiResponse>('/auth/complete-registration', {
    token,
    password,
  });

  window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.accessToken);

  if (data.userClinics.length > 0) {
    window.localStorage.setItem(
      LOCAL_STORAGE_CLINIC_ID,
      data.userClinics[0].clinic.id,
    );
  }

  return { ...data, clinicProfile: data.userClinics[0] };
};

export const useCompleteRegistration = () =>
  useMutation({
    mutationFn: completeRegistration,
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: ['AUTH'],
        },
        data,
      );
    },
  });

type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthdate?: Date;
};

export const useRegister = () => useMutation({ mutationFn: registerUser });

const registerUser = async (payload: TRegisterPayload): Promise<void> => {
  await api.post('/auth/register', payload);
};

type TForgotPasswordPayload = { email: string };

const forgotPassword = async ({
  email,
}: TForgotPasswordPayload): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(
    '/auth/forgot-password',
    { email },
  );

  return data;
};

export const useForgotPassword = () =>
  useMutation({ mutationFn: forgotPassword });

type TResetPasswordPayload = { token: string; password: string };

const resetPassword = async ({
  token,
  password,
}: TResetPasswordPayload): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', {
    token,
    password,
  });

  return data;
};

export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword });

type TCreateClinicPayload = {
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

const createClinic = async (
  payload: TCreateClinicPayload,
): Promise<{ id: string; name: string }> => {
  const { data } = await api.post<{ id: string; name: string }>(
    '/clinics',
    payload,
  );

  window.localStorage.setItem(LOCAL_STORAGE_CLINIC_ID, data.id);

  return data;
};

export const useCreateClinic = () =>
  useMutation({
    mutationFn: createClinic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['AUTH'] });
    },
  });

export const logout = () => {
  queryClient.setQueriesData(
    {
      queryKey: ['AUTH'],
    },
    null,
  );

  queryClient.clear();

  window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  window.localStorage.removeItem(LOCAL_STORAGE_CLINIC_ID);
};

type TGetMeResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userClinics: TClinicProfile[];
};

export const useAuth = () =>
  useQuery<IAuthStore | null>({
    queryKey: ['AUTH'],
    queryFn: async () => {
      const accessToken = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

      if (accessToken) {
        const { data } = await api.get<TGetMeResponse>('/auth/me');

        const payload: IAuthStore = {
          accessToken,
          user: data,
          userClinics: data.userClinics,
          clinicProfile: data.userClinics[0],
        };

        if (data.userClinics.length > 0) {
          window.localStorage.setItem(
            LOCAL_STORAGE_CLINIC_ID,
            data.userClinics[0].clinic.id,
          );
        }

        return payload;
      }

      return null;
    },
    staleTime: Infinity,
  });
