import { Card, Empty, Table, Tag, Typography } from 'antd';

import dayjs from 'dayjs';

import { Banknote, HandCoins, UserRoundX, Wallet } from 'lucide-react';

import { formatCurrency } from '@functions/formatCurrency';

import {
  useCashFlow,
  useFinancialSummary,
  type TCashFlowEntry,
} from '@store/FinancialStore';

import FadeWrapper from '@components/FadeWrapper';

import SummaryCard from './components/SummaryCard';

const { Title } = Typography;

const Financial = () => {
  const { data: summary } = useFinancialSummary();
  const { data: cashFlow } = useCashFlow();

  return (
    <FadeWrapper>
      <div className="mb-3 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          Financeiro
        </Title>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={HandCoins}
          color="#d97706"
          label="Total a receber"
          value={summary ? formatCurrency(summary.accountsReceivable) : '—'}
        />
        <SummaryCard
          icon={UserRoundX}
          color="#dc2626"
          label="Pacientes inadimplentes"
          value={summary ? String(summary.overduePatients) : '—'}
        />
        <SummaryCard
          icon={Banknote}
          color="#16a34a"
          label="Recebido no mês"
          value={summary ? formatCurrency(summary.receivedThisMonth) : '—'}
        />
        <SummaryCard
          icon={Wallet}
          color="#7c3aed"
          label="Saldo do mês"
          value={summary ? formatCurrency(summary.monthBalance) : '—'}
          valueClassName={
            summary && summary.monthBalance < 0 ? 'text-red-600' : undefined
          }
        />
      </div>

      <Card classNames={{ body: 'p-0!' }}>
        <Table
          dataSource={cashFlow || []}
          rowKey="id"
          locale={{
            emptyText: <Empty description="Nenhuma movimentação no período." />,
          }}
          columns={[
            {
              title: 'Data',
              dataIndex: 'date',
              className: 'w-0 whitespace-nowrap',
              render: (v: Date) => dayjs(v).format('DD/MM/YYYY'),
            },
            { title: 'Descrição', dataIndex: 'description' },
            {
              title: 'Paciente',
              dataIndex: 'patientName',
              render: (v: string | null) =>
                v || <span className="text-gray-400">—</span>,
            },
            {
              title: 'Tipo',
              align: 'center',
              className: 'w-0',
              render: ({ type }: TCashFlowEntry) => (
                <Tag
                  variant="outlined"
                  color={type === 'INCOME' ? 'green' : 'red'}
                >
                  {type === 'INCOME' ? 'Entrada' : 'Saída'}
                </Tag>
              ),
            },
            {
              title: 'Status',
              align: 'center',
              className: 'w-0',
              render: ({ status }: TCashFlowEntry) => (
                <Tag
                  variant="outlined"
                  color={status === 'PAID' ? 'blue' : 'gold'}
                >
                  {status === 'PAID' ? 'Pago' : 'Pendente'}
                </Tag>
              ),
            },
            {
              title: 'Valor',
              align: 'right',
              className: 'w-0 whitespace-nowrap',
              render: ({ type, amount }: TCashFlowEntry) => (
                <span
                  className={`font-medium ${
                    type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {type === 'INCOME' ? '+ ' : '- '}
                  {formatCurrency(amount)}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </FadeWrapper>
  );
};

export default Financial;
