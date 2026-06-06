import { useMutation, useQuery } from '@tanstack/react-query';

import {
  LOCAL_STORAGE_CLINIC_ID,
  LOCAL_STORAGE_TOKEN_KEY,
} from '@constants/LOCAL_STORAGE_KEYS';

import type {
  TAuthStore,
  TAuthResponse,
  TAuthLoginPayload,
  TAuthCompleteRegistrationPayload,
  TClinicCreatePayload,
  TAuthForgotPasswordPayload,
  TAuthMeResponse,
  TAuthRegisterPayload,
  TAuthResetPasswordPayload,
} from '@interfaces/Auth.interface';

import api from '../../services/api';

import { queryClient } from './QueryClient';

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

const authUser = async ({
  email,
  password,
}: TAuthLoginPayload): Promise<TAuthStore> => {
  const { data } = await api.post<TAuthResponse>('/auth/login', {
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

const completeRegistration = async ({
  token,
  password,
}: TAuthCompleteRegistrationPayload): Promise<TAuthStore> => {
  const { data } = await api.post<TAuthResponse>('/auth/complete-registration', {
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

export const useRegister = () => useMutation({ mutationFn: registerUser });

const registerUser = async (payload: TAuthRegisterPayload): Promise<void> => {
  await api.post('/auth/register', payload);
};

const forgotPassword = async ({
  email,
}: TAuthForgotPasswordPayload): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(
    '/auth/forgot-password',
    { email },
  );

  return data;
};

export const useForgotPassword = () =>
  useMutation({ mutationFn: forgotPassword });

const resetPassword = async ({
  token,
  password,
}: TAuthResetPasswordPayload): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', {
    token,
    password,
  });

  return data;
};

export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword });

const createClinic = async (
  payload: TClinicCreatePayload,
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

export const useAuth = () =>
  useQuery<TAuthStore | null>({
    queryKey: ['AUTH'],
    queryFn: async () => {
      const accessToken = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

      if (accessToken) {
        const { data } = await api.get<TAuthMeResponse>('/auth/me');

        const payload: TAuthStore = {
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
