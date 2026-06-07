export type TCashFlowType = 'INCOME' | 'EXPENSE';
export type TCashFlowStatus = 'PAID' | 'PENDING' | 'CANCELED';

export type TCashFlowEntry = {
  id: string;
  date: Date;
  description: string | null;
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

export interface TCashFlowEntryReturn {
  id: string;
  date: string;
  description: string | null;
  patientName: string | null;
  type: TCashFlowType;
  status: TCashFlowStatus;
  amount: number;
}
