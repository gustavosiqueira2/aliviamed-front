import dayjs from 'dayjs';

import { Card, Empty, Table, Tag, Typography } from 'antd';
import { Banknote, Clock, TriangleAlert, type LucideIcon } from 'lucide-react';

import { formatCurrency } from '@functions/formatCurrency';
import { getPaymentStatusTag } from '@functions/getPaymentStatusTag';

import type {
  TCashFlowEntry,
  TPatientFinancial,
} from '@interfaces/Financial.interface';

import PayEntryButton from '@components/PayEntryButton';

const { Title, Text } = Typography;

type TPatientFinancialProps = {
  financial: TPatientFinancial;
  loading: boolean;
};

const PatientFinancial: React.FC<TPatientFinancialProps> = (props) => {
  const { financial, loading } = props;

  const summary = financial?.summary;
  const entries = financial?.entries ?? [];

  const summaryCards: {
    icon: LucideIcon;
    color: string;
    label: string;
    value: number;
  }[] = [
    {
      icon: Banknote,
      color: '#16a34a',
      label: 'Recebido',
      value: summary?.received ?? 0,
    },
    {
      icon: Clock,
      color: '#d97706',
      label: 'A receber',
      value: summary?.pending ?? 0,
    },
    {
      icon: TriangleAlert,
      color: '#dc2626',
      label: 'Vencido',
      value: summary?.overdue ?? 0,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map(({ icon: Icon, color, label, value }) => (
          <Card key={label} classNames={{ body: 'p-4!' }}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Icon size={14} style={{ color }} />

                <Title level={5} type="secondary" className="my-0! text-sm!">
                  {label}
                </Title>
              </div>

              <Text className="text-2xl!" style={{ color }}>
                {formatCurrency(value)}
              </Text>
            </div>
          </Card>
        ))}
      </div>

      <Card classNames={{ body: 'p-0! overflow-hidden' }}>
        <Table<TCashFlowEntry>
          dataSource={entries}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Nenhuma movimentação financeira para este paciente."
              />
            ),
          }}
          columns={[
            {
              title: 'Data',
              dataIndex: 'date',
              className: 'w-0 whitespace-nowrap',
              render: (v: Date) => dayjs(v).format('DD/MM/YYYY'),
            },
            {
              title: 'Descrição',
              dataIndex: 'description',
              render: (v: string | null) =>
                v || <span className="text-gray-400">—</span>,
            },
            {
              title: 'Status',
              align: 'center',
              className: 'w-0',
              render: (entry: TCashFlowEntry) => {
                const tag = getPaymentStatusTag(entry.status, entry.dueAt);

                return (
                  <Tag variant="outlined" color={tag.color}>
                    {tag.label}
                  </Tag>
                );
              },
            },
            {
              title: 'Valor',
              align: 'right',
              className: 'w-0 whitespace-nowrap',
              render: ({ amount, status }: TCashFlowEntry) => (
                <span
                  className={`font-medium ${
                    status === 'CANCELED' ? 'text-gray-400 line-through' : ''
                  }`}
                >
                  {formatCurrency(amount)}
                </span>
              ),
            },
            {
              title: '',
              align: 'right',
              className: 'w-0 whitespace-nowrap',
              render: (entry: TCashFlowEntry) => <PayEntryButton entry={entry} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default PatientFinancial;
