export type TCashFlowType = 'INCOME' | 'EXPENSE';
export type TCashFlowStatus = 'PAID' | 'PENDING' | 'CANCELED';

export type TCashFlowEntry = {
  id: string;
  date: Date;
  dueAt: Date | null;
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
  dueAt: string | null;
  description: string | null;
  patientName: string | null;
  type: TCashFlowType;
  status: TCashFlowStatus;
  amount: number;
}

export type TPatientFinancialSummary = {
  received: number;
  pending: number;
  overdue: number;
};

export type TPatientFinancialReturn = {
  entries: TCashFlowEntryReturn[];
  summary: TPatientFinancialSummary;
};

export type TPatientFinancial = {
  entries: TCashFlowEntry[];
  summary: TPatientFinancialSummary;
};

export type TAppointmentPaymentReturn = {
  id: string;
  status: TCashFlowStatus;
  amount: number;
  dueAt: string | null;
  paidAt: string | null;
  paymentMethod: string | null;
} | null;

export type TAppointmentPayment = {
  id: string;
  status: TCashFlowStatus;
  amount: number;
  dueAt: Date | null;
  paidAt: Date | null;
  paymentMethod: string | null;
};

export type TPayFinancialPayload = {
  id: string;
  paymentMethod?: string;
  paidAt?: string;
};
