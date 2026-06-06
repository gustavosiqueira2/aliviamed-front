import type { ApiMeta } from '@interfaces/ApiMeta.interface';

export type TPatientSex = 'MALE' | 'FEMALE' | 'OTHER';

export interface TPatient {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  birthdate: Date;
  phone?: string;
  emergencyPhone?: string;
  document?: string;
  sex?: TPatientSex;
  email?: string;
}

export interface TPatientReturn {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  birthdate: string;
  phone?: string;
  emergencyPhone?: string;
  document?: string;
  sex?: TPatientSex;
  email?: string;
}

export interface TPatientListResponse {
  data: TPatient[];
  meta: ApiMeta;
}

export type TPatientQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

export type TPatientListReturn = {
  data: TPatientReturn[];
  meta: ApiMeta;
};

export type TPatientPayload = {
  name: string;
  birthdate: string;
  phone?: string | null;
  emergencyPhone?: string | null;
  document?: string | null;
  sex?: string | null;
  email?: string | null;
};

export type TPatientSearchResponse = {
  id: string;
  name: string;
}[];
