import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import type { ApiMeta } from '@interfaces/ApiMeta.interface';

import api from '../../services/api';
import type { TGetConsultApiReturn } from './Consult';
import { queryClient } from './QueryClient';

export type PatientSex = 'MALE' | 'FEMALE' | 'OTHER';

interface IPatient {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  birthdate: Date;
  phone?: string;
  emergencyPhone?: string;
  document?: string;
  sex?: PatientSex;
  email?: string;
}

interface IApiPatient {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  birthdate: string;
  phone?: string;
  emergencyPhone?: string;
  document?: string;
  sex?: PatientSex;
  email?: string;
}

interface IPatients {
  data: IPatient[];
  meta: ApiMeta;
}

type TPatientsQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

export const usePatients = (query: TPatientsQuery = {}) =>
  useQuery({
    queryKey: ['PATIENTS', query],
    queryFn: () => getPatients(query),
    placeholderData: keepPreviousData,
  });

type TGetPatientsResponse = {
  data: IApiPatient[];
  meta: ApiMeta;
};

const getPatients = async ({
  search,
  page,
  limit,
}: TPatientsQuery): Promise<IPatients> => {
  const { data } = await api.get<TGetPatientsResponse>('/patient', {
    params: {
      ...(search ? { search } : {}),
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
    },
  });

  const patients: IPatients = {
    ...data,
    data: data.data.map((p) => ({
      ...p,
      birthdate: dayjs(p.birthdate).toDate(),
    })),
  };

  return patients;
};

type TCreateUpdatePatientPayload = {
  name: string;
  birthdate: string;
  phone?: string | null;
  emergencyPhone?: string | null;
  document?: string | null;
  sex?: string | null;
  email?: string | null;
};

type SearchPatientsResponse = {
  id: string;
  name: string;
}[];

export const useSearchPatients = (name: string) =>
  useQuery({
    queryKey: ['PATIENTS-SEARCH', name],
    queryFn: () => searchPatients(name),
    enabled: name.length >= 2,
  });

const searchPatients = async (name: string) => {
  const { data } = await api.get<SearchPatientsResponse>('/patient/search', {
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
  payload: TCreateUpdatePatientPayload,
): Promise<IPatient> => {
  const { data } = await api.post<IApiPatient>('/patient', payload);

  const patient: IPatient = {
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

const getPatient = async (id: string): Promise<IPatient> => {
  const { data } = await api.get<IApiPatient>(`/patient/${id}`);

  const patient: IPatient = {
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
}: TCreateUpdatePatientPayload & { id: string }) => {
  await api.put(`/patient/${id}`, payload);
};

export const usePatientConsultHistory = (patientId?: string) =>
  useQuery({
    queryKey: ['PATIENT_CONSULT_HISTORY', patientId],
    queryFn: () => getPatientConsultHistory(patientId!),
    enabled: !!patientId,
  });

const getPatientConsultHistory = async (patientId: string) => {
  const { data } = await api.get<TGetConsultApiReturn[]>(
    `patient/${patientId}/consult`,
  );

  return data;
};
