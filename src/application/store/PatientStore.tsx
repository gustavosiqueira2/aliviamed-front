import { useMutation, useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import type { ApiMeta } from '@interfaces/ApiMeta.interface';

import api from '../../services/api';

interface IPatient {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  birthdate: Date;
}

interface IApiPatient {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  birthdate: string;
}

interface IPatients {
  data: IPatient[];
  meta: ApiMeta;
}

export const usePatients = () =>
  useQuery({
    queryKey: ['PATIENTS'],
    queryFn: getPatients,
  });

type TGetPatientsResponse = {
  data: IApiPatient[];
  meta: ApiMeta;
};

const getPatients = async (): Promise<IPatients> => {
  const { data } = await api.get<TGetPatientsResponse>('/patient');

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
