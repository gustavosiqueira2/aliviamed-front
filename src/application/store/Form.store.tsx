import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import type {
  TAnswerFormPayload,
  TCreateFormPayload,
  TForm,
  TFormDetail,
  TFormOption,
  TFormsQuery,
  TFormsResponse,
  TPatientFormSubmission,
  TPublicFormSubmission,
  TSendFormPayload,
} from '@interfaces/Form.interface';

import api from '../../services/api';

import { queryClient } from './QueryClient';

export const useForms = (query: TFormsQuery = {}) =>
  useQuery({
    queryKey: ['FORMS', query],
    queryFn: () => getForms(query),
    placeholderData: keepPreviousData,
  });

const getForms = async (query: TFormsQuery): Promise<TFormsResponse> => {
  const { data } = await api.get<TFormsResponse>('/form', {
    params: {
      page: query.page,
      limit: query.limit,
      ...(query.search ? { search: query.search } : {}),
      ...(query.professionalId ? { professionalId: query.professionalId } : {}),
      ...(query.status && query.status !== 'all'
        ? { status: query.status }
        : {}),
    },
  });

  return data;
};

export const useFormOptions = () =>
  useQuery({
    queryKey: ['FORM_OPTIONS'],
    queryFn: getFormOptions,
  });

const getFormOptions = async (): Promise<TFormOption[]> => {
  const { data } = await api.get<TFormOption[]>('/form/options');

  return data;
};

export const useForm = (id?: string | null) =>
  useQuery({
    queryKey: ['FORM', id],
    queryFn: () => getForm(id!),
    enabled: !!id,
  });

const getForm = async (id: string): Promise<TFormDetail> => {
  const { data } = await api.get<TFormDetail>(`/form/${id}`);

  return data;
};

export const usePatientFormSubmissions = (patientId?: string) =>
  useQuery({
    queryKey: ['PATIENT_FORM_SUBMISSIONS', patientId],
    queryFn: () => getPatientFormSubmissions(patientId!),
    enabled: !!patientId,
  });

const getPatientFormSubmissions = async (
  patientId: string,
): Promise<TPatientFormSubmission[]> => {
  const { data } = await api.get<TPatientFormSubmission[]>(
    `/form/patient/${patientId}/submissions`,
  );

  return data;
};

export const useResendFormSubmission = () =>
  useMutation({
    mutationFn: resendFormSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['PATIENT_FORM_SUBMISSIONS'] });
    },
  });

const resendFormSubmission = async (id: string) => {
  await api.post(`/form-submission/${id}/resend`);
};

export const useCreateForm = () =>
  useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['FORMS'] });
      queryClient.invalidateQueries({ queryKey: ['FORM_OPTIONS'] });
    },
  });

const sendForm = async (payload: TSendFormPayload) => {
  await api.post('/form-submission', payload);
};

export const useSendForm = () =>
  useMutation({
    mutationFn: sendForm,
  });

const getPublicFormSubmission = async (
  token: string,
): Promise<TPublicFormSubmission> => {
  const { data } = await api.get<TPublicFormSubmission>(
    '/public/form-submission',
    { params: { token } },
  );

  return data;
};

export const usePublicFormSubmission = (token?: string | null) =>
  useQuery({
    queryKey: ['PUBLIC_FORM_SUBMISSION', token],
    queryFn: () => getPublicFormSubmission(token!),
    enabled: !!token,
    retry: false,
  });

const answerFormSubmission = async (payload: TAnswerFormPayload) => {
  await api.post('/public/form-submission/answer', payload);
};

export const useAnswerFormSubmission = () =>
  useMutation({
    mutationFn: answerFormSubmission,
  });

const createForm = async (payload: TCreateFormPayload): Promise<TForm> => {
  const { data } = await api.post<TForm>('/form', payload);

  return data;
};
