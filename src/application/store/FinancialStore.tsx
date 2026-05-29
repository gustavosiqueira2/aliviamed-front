import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

// import api from '../../services/api';

export type TCashFlowType = 'INCOME' | 'EXPENSE';
export type TCashFlowStatus = 'PAID' | 'PENDING';

export type TCashFlowEntry = {
  id: string;
  date: Date;
  description: string;
  patientName: string | null;
  type: TCashFlowType;
  status: TCashFlowStatus;
  amount: number;
};

export type TFinancialSummary = {
  accountsReceivable: number;
  overduePatients: number;
  receivedThisMonth: number;
  monthBalance: number;
};

// Formato esperado da futura API (datas como string ISO).
interface IApiCashFlowEntry {
  id: string;
  date: string;
  description: string;
  patientName: string | null;
  type: TCashFlowType;
  status: TCashFlowStatus;
  amount: number;
}

// ---------------------------------------------------------------------------
// MOCK temporário: não existe módulo financeiro na API ainda.
// Quando existir, basta remover este bloco e trocar pelas chamadas reais
// indicadas com TODO em cada queryFn abaixo.
// ---------------------------------------------------------------------------
const buildMockCashFlow = (): IApiCashFlowEntry[] => {
  const today = dayjs();

  return [
    {
      id: '1',
      date: today.subtract(1, 'day').toISOString(),
      description: 'Consulta - Avaliação',
      patientName: 'Maria Souza',
      type: 'INCOME',
      status: 'PAID',
      amount: 250,
    },
    {
      id: '2',
      date: today.subtract(2, 'day').toISOString(),
      description: 'Consulta - Retorno',
      patientName: 'João Pereira',
      type: 'INCOME',
      status: 'PAID',
      amount: 180,
    },
    {
      id: '3',
      date: today.subtract(6, 'day').toISOString(),
      description: 'Procedimento estético',
      patientName: 'Beatriz Rocha',
      type: 'INCOME',
      status: 'PAID',
      amount: 600,
    },
    {
      id: '4',
      date: today.subtract(1, 'day').toISOString(),
      description: 'Consulta - Avaliação',
      patientName: 'Lucas Martins',
      type: 'INCOME',
      status: 'PAID',
      amount: 300,
    },
    {
      id: '5',
      date: today.subtract(2, 'day').toISOString(),
      description: 'Pacote de sessões',
      patientName: 'Patrícia Gomes',
      type: 'INCOME',
      status: 'PAID',
      amount: 900,
    },
    {
      id: '6',
      date: today.subtract(3, 'day').toISOString(),
      description: 'Sessão de fisioterapia',
      patientName: 'Ana Lima',
      type: 'INCOME',
      status: 'PENDING',
      amount: 150,
    },
    {
      id: '7',
      date: today.subtract(5, 'day').toISOString(),
      description: 'Consulta - Avaliação',
      patientName: 'Carlos Mendes',
      type: 'INCOME',
      status: 'PENDING',
      amount: 250,
    },
    {
      id: '8',
      date: today.subtract(4, 'day').toISOString(),
      description: 'Consulta - Retorno',
      patientName: 'Fernanda Alves',
      type: 'INCOME',
      status: 'PENDING',
      amount: 180,
    },
    {
      id: '9',
      date: today.add(2, 'day').toISOString(),
      description: 'Consulta agendada',
      patientName: 'Rafael Dias',
      type: 'INCOME',
      status: 'PENDING',
      amount: 250,
    },
    {
      id: '10',
      date: today.subtract(7, 'day').toISOString(),
      description: 'Aluguel da sala',
      patientName: null,
      type: 'EXPENSE',
      status: 'PAID',
      amount: 1200,
    },
    {
      id: '11',
      date: today.subtract(8, 'day').toISOString(),
      description: 'Material de consumo',
      patientName: null,
      type: 'EXPENSE',
      status: 'PAID',
      amount: 230,
    },
  ];
};

const mapEntry = (entry: IApiCashFlowEntry): TCashFlowEntry => ({
  ...entry,
  date: dayjs(entry.date).toDate(),
});

const getCashFlow = async (): Promise<TCashFlowEntry[]> => {
  // TODO: quando o módulo financeiro existir na API, troque o mock por:
  // const { data } = await api.get<IApiCashFlowEntry[]>('/financial/cash-flow');
  // return data.map(mapEntry);
  return buildMockCashFlow()
    .map(mapEntry)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const useCashFlow = () =>
  useQuery({
    queryKey: ['FINANCIAL-CASH-FLOW'],
    queryFn: getCashFlow,
  });

const getFinancialSummary = async (): Promise<TFinancialSummary> => {
  // TODO: quando o módulo financeiro existir na API, troque o mock por:
  // const { data } = await api.get<TFinancialSummary>('/financial/summary');
  // return data;
  const entries = buildMockCashFlow().map(mapEntry);
  const now = dayjs();
  const isThisMonth = (date: Date) => dayjs(date).isSame(now, 'month');

  const accountsReceivable = entries
    .filter((e) => e.type === 'INCOME' && e.status === 'PENDING')
    .reduce((sum, e) => sum + e.amount, 0);

  const overduePatients = new Set(
    entries
      .filter(
        (e) =>
          e.type === 'INCOME' &&
          e.status === 'PENDING' &&
          !!e.patientName &&
          dayjs(e.date).isBefore(now, 'day'),
      )
      .map((e) => e.patientName),
  ).size;

  const receivedThisMonth = entries
    .filter(
      (e) => e.type === 'INCOME' && e.status === 'PAID' && isThisMonth(e.date),
    )
    .reduce((sum, e) => sum + e.amount, 0);

  const monthBalance = entries
    .filter((e) => e.status === 'PAID' && isThisMonth(e.date))
    .reduce((sum, e) => sum + (e.type === 'INCOME' ? e.amount : -e.amount), 0);

  return {
    accountsReceivable,
    overduePatients,
    receivedThisMonth,
    monthBalance,
  };
};

export const useFinancialSummary = () =>
  useQuery({
    queryKey: ['FINANCIAL-SUMMARY'],
    queryFn: getFinancialSummary,
  });
