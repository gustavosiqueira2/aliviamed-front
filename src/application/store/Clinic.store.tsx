import { useMutation, useQuery } from '@tanstack/react-query';

import type {
  TClinicSearchProfessionalResponse,
  TClinicAddCollaboratorPayload,
  TClinicChangeUserPermissionsPayload,
  TClinicChangeUserRolePayload,
  TClinicChangeUserStatusPayload,
  TClinicResponse,
  TClinicPermissionCatalog,
  TClinicUpdatePricesPayload,
} from '@interfaces/Clinic.interface';

import api from '../../services/api';
import { queryClient } from './QueryClient';

export const useClinic = () =>
  useQuery({
    queryKey: ['CLINIC'],
    queryFn: getClinic,
    staleTime: 1000 * 60 * 5,
  });

const getClinic = async () => {
  const { data } = await api.get<TClinicResponse>(`/clinic/me`);

  return data;
};

export const useAddCollaborator = () =>
  useMutation({
    mutationFn: addCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const addCollaborator = async (payload: TClinicAddCollaboratorPayload) => {
  const { data } = await api.post('/clinic/users', payload);

  return data;
};

export const useChangeUserStatus = () =>
  useMutation({
    mutationFn: changeUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const changeUserStatus = async ({ id, status }: TClinicChangeUserStatusPayload) => {
  if (status) {
    await api.patch('/clinic/users/activate', { id });
  } else {
    await api.patch('/clinic/users/deactivate', { id });
  }
};

export const useAcceptInvite = () =>
  useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['AUTH'] });
    },
  });

const acceptInvite = async (clinicId: string) => {
  const { data } = await api.patch(`/clinics/${clinicId}/accept`);

  return data;
};

export const useArchiveUser = () =>
  useMutation({
    mutationFn: archiveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const archiveUser = async (id: string) => {
  await api.patch('/clinic/users/archive', { id });
};

export const useUnarchiveUser = () =>
  useMutation({
    mutationFn: unarchiveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const unarchiveUser = async (id: string) => {
  await api.patch('/clinic/users/unarchive', { id });
};

export const useUpdateUserPrices = () =>
  useMutation({
    mutationFn: updateUserPrices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const updateUserPrices = async (payload: TClinicUpdatePricesPayload) => {
  await api.patch('/clinic/users/prices', payload);
};

export const useChangeUserRole = () =>
  useMutation({
    mutationFn: changeUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CLINIC'] });
    },
  });

const changeUserRole = async ({ id, role }: TClinicChangeUserRolePayload) => {
  const { data } = await api.patch('/clinic/users/role', { id, role });

  return data;
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
}: TClinicChangeUserPermissionsPayload) => {
  const { data } = await api.patch('/clinic/users/permissions', {
    id,
    permissions,
  });

  return data;
};

export const usePermissionCatalog = () =>
  useQuery({
    queryKey: ['CLINIC-PERMISSIONS'],
    queryFn: getPermissionCatalog,
  });

const getPermissionCatalog = async () => {
  const { data } = await api.get<TClinicPermissionCatalog>('/clinic/permissions');

  return data;
};

export const useSearchProfessional = (name: string) =>
  useQuery({
    queryKey: ['CLINIC-PROFESSIONAL-SEARCH', name],
    queryFn: () => searchProfessional(name),
    enabled: name.length >= 2,
  });

const searchProfessional = async (name: string) => {
  const { data } = await api.get<TClinicSearchProfessionalResponse>(
    '/clinic/professionals/search',
    {
      params: { name },
    },
  );

  return data;
};
