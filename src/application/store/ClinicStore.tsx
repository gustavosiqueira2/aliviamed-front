import { useMutation, useQuery } from '@tanstack/react-query';

import type { USER_ROLES } from '@constants/USER_ROLES';

import api from '../../services/api';
import { queryClient } from './QueryClient';

export const useClinic = () =>
  useQuery({
    queryKey: ['CLINIC'],
    queryFn: getClinic,
    staleTime: 1000 * 60 * 5,
  });

export type TClinicUser = {
  userId: string;
  name: string;
  email: string;
  role: keyof typeof USER_ROLES;
  permissions: string[];
  active: boolean;
};

type TGetClinicResponse = {
  name: string;
  participants: TClinicUser[];
};

const getClinic = async () => {
  const { data } = await api.get<TGetClinicResponse>(`/clinic/me`);

  return data;
};

type TAddCollaboratorPayload = {
  name: string;
  email: string;
  role: keyof typeof USER_ROLES;
};

export const useAddCollaborator = () =>
  useMutation({
    mutationFn: addCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const addCollaborator = async (payload: TAddCollaboratorPayload) => {
  const { data } = await api.post('/clinic/users', payload);

  return data;
};

type TChangeUserStatusPayload = {
  id: string;
  status: boolean;
};

export const useChangeUserStatus = () =>
  useMutation({
    mutationFn: changeUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const changeUserStatus = async ({ id, status }: TChangeUserStatusPayload) => {
  if (status) {
    await api.patch('/clinic/users/activate', { id });
  } else {
    await api.patch('/clinic/users/deactivate', { id });
  }
};

type TChangeUserRolePayload = {
  id: string;
  role: keyof typeof USER_ROLES;
};

export const useChangeUserRole = () =>
  useMutation({
    mutationFn: changeUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const changeUserRole = async ({ id, role }: TChangeUserRolePayload) => {
  const { data } = await api.patch('/clinic/users/role', { id, role });

  return data;
};

type TChangeUserPermissionsPayload = {
  id: string;
  permissions: string[];
};

export const useChangeUserPermissions = () =>
  useMutation({
    mutationFn: changeUserPermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const changeUserPermissions = async ({
  id,
  permissions,
}: TChangeUserPermissionsPayload) => {
  const { data } = await api.patch('/clinic/users/permissions', {
    id,
    permissions,
  });

  return data;
};

export type TPermissionCatalog = {
  permissions: { key: string; label: string }[];
  presets: Partial<Record<keyof typeof USER_ROLES, string[]>>;
};

export const usePermissionCatalog = () =>
  useQuery({
    queryKey: ['CLINIC-PERMISSIONS'],
    queryFn: getPermissionCatalog,
  });

const getPermissionCatalog = async () => {
  const { data } = await api.get<TPermissionCatalog>('/clinic/permissions');

  return data;
};

type SearchProfessionalResponse = {
  id: string;
  name: string;
}[];

export const useSearchProfessional = (name: string) =>
  useQuery({
    queryKey: ['CLINIC-PROFESSIONAL-SEARCH', name],
    queryFn: () => searchProfessional(name),
    enabled: name.length >= 2,
  });

const searchProfessional = async (name: string) => {
  const { data } = await api.get<SearchProfessionalResponse>(
    '/clinic/professionals/search',
    {
      params: { name },
    },
  );

  return data;
};
