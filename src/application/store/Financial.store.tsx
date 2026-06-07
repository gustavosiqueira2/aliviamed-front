import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import type {
  TCashFlowEntryReturn,
  TCashFlowEntry,
  TFinancialSummary,
} from '@interfaces/Financial.interface';

import api from '../../services/api';

const mapEntry = (entry: TCashFlowEntryReturn): TCashFlowEntry => ({
  ...entry,
  date: dayjs(entry.date).toDate(),
});

const getCashFlow = async (): Promise<TCashFlowEntry[]> => {
  const { data } = await api.get<TCashFlowEntryReturn[]>('/financial');

  return data
    .map(mapEntry)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const useCashFlow = () =>
  useQuery({
    queryKey: ['FINANCIAL-CASH-FLOW'],
    queryFn: getCashFlow,
  });

const getFinancialSummary = async (): Promise<TFinancialSummary> => {
  const { data } = await api.get<TFinancialSummary>('/financial/summary');

  return data;
};

export const useFinancialSummary = () =>
  useQuery({
    queryKey: ['FINANCIAL-SUMMARY'],
    queryFn: getFinancialSummary,
  });
