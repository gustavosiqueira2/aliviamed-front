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
  clinicProfile: TClinicProfile;
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

  if (data.userClinics.length <= 1) {
    window.localStorage.setItem(
      LOCAL_STORAGE_CLINIC_ID,
      data.userClinics[0].clinic.id,
    );
  }

  return { ...data, clinicProfile: data.userClinics[0] };
};

export const logout = () => {
  queryClient.setQueriesData(
    {
      queryKey: ['AUTH'],
    },
    null,
  );

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

        window.localStorage.setItem(
          LOCAL_STORAGE_CLINIC_ID,
          data.userClinics[0].clinic.id,
        );

        return payload;
      }

      return null;
    },
    staleTime: Infinity,
  });
