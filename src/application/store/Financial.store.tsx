import { useMutation, useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import type {
  TCashFlowEntryReturn,
  TCashFlowEntry,
  TFinancialSummary,
  TPatientFinancial,
  TPatientFinancialReturn,
  TAppointmentPayment,
  TAppointmentPaymentReturn,
  TPayFinancialPayload,
} from '@interfaces/Financial.interface';

import api from '../../services/api';

import { queryClient } from './QueryClient';

const mapEntry = (entry: TCashFlowEntryReturn): TCashFlowEntry => ({
  ...entry,
  date: dayjs(entry.date).toDate(),
  dueAt: entry.dueAt ? dayjs(entry.dueAt).toDate() : null,
});

export const useCashFlow = () =>
  useQuery({
    queryKey: ['FINANCIAL-CASH-FLOW'],
    queryFn: getCashFlow,
  });

const getCashFlow = async (): Promise<TCashFlowEntry[]> => {
  const { data } = await api.get<TCashFlowEntryReturn[]>('/financial');

  return data.map(mapEntry).sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const useFinancialSummary = () =>
  useQuery({
    queryKey: ['FINANCIAL-SUMMARY'],
    queryFn: getFinancialSummary,
  });

const getFinancialSummary = async (): Promise<TFinancialSummary> => {
  const { data } = await api.get<TFinancialSummary>('/financial/summary');

  return data;
};

const getPatientFinancial = async (
  patientId: string,
): Promise<TPatientFinancial> => {
  const { data } = await api.get<TPatientFinancialReturn>(
    `/financial/patient/${patientId}`,
  );

  return {
    summary: data.summary,
    entries: data.entries
      .map(mapEntry)
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  };
};

export const usePatientFinancial = (patientId?: string, enabled = true) =>
  useQuery({
    queryKey: ['PATIENT-FINANCIAL', patientId],
    queryFn: () => getPatientFinancial(patientId!),
    enabled: enabled && !!patientId,
  });

const getPaymentByAppointment = async (
  appointmentId: string,
): Promise<TAppointmentPayment | null> => {
  const { data } = await api.get<TAppointmentPaymentReturn>(
    `/financial/appointment/${appointmentId}`,
  );

  if (!data) return null;

  return {
    id: data.id,
    status: data.status,
    amount: data.amount,
    dueAt: data.dueAt ? dayjs(data.dueAt).toDate() : null,
    paidAt: data.paidAt ? dayjs(data.paidAt).toDate() : null,
    paymentMethod: data.paymentMethod,
  };
};

export const usePaymentByAppointment = (appointmentId?: string) =>
  useQuery({
    queryKey: ['APPOINTMENT-PAYMENT', appointmentId],
    queryFn: () => getPaymentByAppointment(appointmentId!),
    enabled: !!appointmentId,
  });

const payFinancialEntry = async ({
  id,
  paymentMethod,
  paidAt,
}: TPayFinancialPayload) => {
  await api.patch(`/financial/${id}/pay`, { paymentMethod, paidAt });
};

export const usePayFinancialEntry = () =>
  useMutation({
    mutationFn: payFinancialEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['APPOINTMENT-PAYMENT'] });
      queryClient.invalidateQueries({ queryKey: ['PATIENT-FINANCIAL'] });
      queryClient.invalidateQueries({ queryKey: ['FINANCIAL-CASH-FLOW'] });
      queryClient.invalidateQueries({ queryKey: ['FINANCIAL-SUMMARY'] });
    },
  });
