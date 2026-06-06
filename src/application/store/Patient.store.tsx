import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import type {
  TPatientReturn,
  TPatient,
  TPatientListResponse,
  TPatientSearchResponse,
  TPatientPayload,
  TPatientListReturn,
  TPatientQuery,
} from '@interfaces/Patient.interface';
import type { TConsult } from '@interfaces/Consult.interface';

import api from '../../services/api';
import { queryClient } from './QueryClient';

export const usePatients = (query: TPatientQuery = {}) =>
  useQuery({
    queryKey: ['PATIENTS', query],
    queryFn: () => getPatients(query),
    placeholderData: keepPreviousData,
  });

const getPatients = async ({
  search,
  page,
  limit,
}: TPatientQuery): Promise<TPatientListResponse> => {
  const { data } = await api.get<TPatientListReturn>('/patient', {
    params: {
      ...(search ? { search } : {}),
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
    },
  });

  const patients: TPatientListResponse = {
    ...data,
    data: data.data.map((p) => ({
      ...p,
      birthdate: dayjs(p.birthdate).toDate(),
    })),
  };

  return patients;
};

export const useSearchPatients = (name: string) =>
  useQuery({
    queryKey: ['PATIENTS-SEARCH', name],
    queryFn: () => searchPatients(name),
    enabled: name.length >= 2,
  });

const searchPatients = async (name: string) => {
  const { data } = await api.get<TPatientSearchResponse>('/patient/search', {
    params: { name },
  });

  return data;
};

export const useCreatePatient = () =>
  useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['PATIENTS'],
        exact: false,
      });
    },
  });

const createPatient = async (
  payload: TPatientPayload,
): Promise<TPatient> => {
  const { data } = await api.post<TPatientReturn>('/patient', payload);

  const patient: TPatient = {
    ...data,
    birthdate: dayjs(data.birthdate).toDate(),
  };

  return patient;
};

export const usePatient = (id: string) =>
  useQuery({
    queryKey: ['PATIENTS', id],
    queryFn: () => getPatient(id),
    enabled: !!id,
  });

const getPatient = async (id: string): Promise<TPatient> => {
  const { data } = await api.get<TPatientReturn>(`/patient/${id}`);

  const patient: TPatient = {
    ...data,
    birthdate: dayjs(data.birthdate).toDate(),
  };

  return patient;
};

export const useUpdatePatient = () =>
  useMutation({
    mutationFn: updatePatient,
  });

const updatePatient = async ({
  id,
  ...payload
}: TPatientPayload & { id: string }) => {
  await api.put(`/patient/${id}`, payload);
};

export const usePatientConsultHistory = (patientId?: string) =>
  useQuery({
    queryKey: ['PATIENT_CONSULT_HISTORY', patientId],
    queryFn: () => getPatientConsultHistory(patientId!),
    enabled: !!patientId,
  });

const getPatientConsultHistory = async (patientId: string) => {
  const { data } = await api.get<TConsult[]>(
    `patient/${patientId}/consult`,
  );

  return data;
};
