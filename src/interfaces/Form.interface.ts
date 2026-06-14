import type { TInput } from '@pages/Forms/NewForm/NewForm';

import type { ApiMeta } from '@interfaces/ApiMeta.interface';

export type TFormSchemaGroup = {
  id: string;
  title: string;
  description: string;
  inputs: TInput[];
};

export type TForm = {
  id: string;
  name: string;
  createdAt: string;
  professionalId: string | null;
  professionalName: string | null;
  fields: number;
  sent: number;
  answered: number;
  pending: number;
};

export type TFormDetail = TForm & {
  schema: TFormSchemaGroup[];
};

export type TFormStatusFilter = 'all' | 'pending' | 'done';

export type TFormSummary = {
  forms: number;
  sent: number;
  answered: number;
  pending: number;
  counts: {
    all: number;
    pending: number;
    done: number;
  };
};

export type TFormProfessionalOption = {
  id: string;
  name: string;
};

export type TFormsResponse = {
  data: TForm[];
  meta: ApiMeta;
  summary: TFormSummary;
  professionals: TFormProfessionalOption[];
};

export type TFormsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  professionalId?: string | null;
  status?: TFormStatusFilter;
};

export type TFormOption = {
  id: string;
  name: string;
  professionalId: string | null;
};

export type TFormSubmissionStatus = 'PENDING' | 'ANSWERED' | 'EXPIRED';

export type TPatientFormSubmission = {
  id: string;
  status: TFormSubmissionStatus;
  formName: string | null;
  professionalName: string | null;
  sentAt: string;
  answeredAt: string | null;
  expiresAt: string;
};

export type TPublicFormSubmission = {
  status: TFormSubmissionStatus;
  clinicName: string | null;
  professionalName: string | null;
  formName: string | null;
  patientName: string | null;
  schema: TFormSchemaGroup[];
};

export type TSendFormPayload = {
  formId: string;
  patientId: string;
};

export type TAnswerFormPayload = {
  token: string;
  answers: Record<string, unknown>;
};

export type TCreateFormPayload = {
  name: string;
  schema: TFormSchemaGroup[];
};
