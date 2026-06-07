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
  TClinicProfile,
} from '@interfaces/Auth.interface';

import api from '../../services/api';

import { queryClient } from './QueryClient';

const resolveActiveClinic = (
  clinics: TClinicProfile[],
): TClinicProfile | undefined => {
  const activeClinics = clinics.filter((clinic) => clinic.status === 'ACTIVE');

  const savedClinicId = window.localStorage.getItem(LOCAL_STORAGE_CLINIC_ID);

  const saved =
    savedClinicId &&
    activeClinics.find((clinic) => clinic.clinic.id === savedClinicId);

  const active = saved || activeClinics[0];

  if (active) {
    window.localStorage.setItem(LOCAL_STORAGE_CLINIC_ID, active.clinic.id);
  } else {
    window.localStorage.removeItem(LOCAL_STORAGE_CLINIC_ID);
  }

  return active;
};

/**
 * QueryKeys cujos dados dependem da clínica atual (x-clinic-id). Ao trocar de
 * clínica, são resetadas para refazer com o novo header — sem tocar em ['AUTH']
 * (atualizada otimisticamente) nem em estado global (tema).
 */
const CLINIC_SCOPED_QUERY_KEYS = [
  ['CLINIC'],
  ['CLINIC-PERMISSIONS'],
  ['CLINIC-PROFESSIONAL-SEARCH'],
  ['PATIENTS'],
  ['PATIENTS-SEARCH'],
  ['PATIENT_CONSULT_HISTORY'],
  ['APPOINTMENTS'],
  ['ACTIVE_CONSULT'],
  ['APPOINTMENT_CONSULT'],
  ['FINANCIAL-CASH-FLOW'],
  ['FINANCIAL-SUMMARY'],
];

export const switchClinic = (clinicId: string) => {
  const current = queryClient.getQueryData<TAuthStore | null>(['AUTH']);

  if (!current) return;

  const target = current.userClinics.find(
    (clinic) => clinic.clinic.id === clinicId && clinic.status === 'ACTIVE',
  );

  if (!target || target.clinic.id === current.clinicProfile?.clinic.id) return;

  window.localStorage.setItem(LOCAL_STORAGE_CLINIC_ID, clinicId);

  queryClient.setQueryData<TAuthStore>(['AUTH'], {
    ...current,
    clinicProfile: target,
  });

  CLINIC_SCOPED_QUERY_KEYS.forEach((queryKey) => {
    queryClient.resetQueries({ queryKey });
  });
};

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

  return { ...data, clinicProfile: resolveActiveClinic(data.userClinics) };
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

const completeRegistration = async ({
  token,
  password,
}: TAuthCompleteRegistrationPayload): Promise<TAuthStore> => {
  const { data } = await api.post<TAuthResponse>(
    '/auth/complete-registration',
    {
      token,
      password,
    },
  );

  window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.accessToken);

  return { ...data, clinicProfile: resolveActiveClinic(data.userClinics) };
};

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
          invites: data.invites,
          clinicProfile: resolveActiveClinic(data.userClinics),
        };

        return payload;
      }

      return null;
    },
    staleTime: Infinity,
  });
