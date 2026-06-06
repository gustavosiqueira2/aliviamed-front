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
export interface TCashFlowEntryReturn {
  id: string;
  date: string;
  description: string;
  patientName: string | null;
  type: TCashFlowType;
  status: TCashFlowStatus;
  amount: number;
}
