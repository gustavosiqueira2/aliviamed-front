import dayjs from 'dayjs';

import { Button, Card, Empty, Table, Tooltip, type TableProps } from 'antd';
import {
  CheckCircle2,
  CircleAlert,
  Clock,
  Send,
  type LucideIcon,
} from 'lucide-react';

import { PERMISSIONS } from '@constants/PERMISSIONS';

import type {
  TFormSubmissionStatus,
  TPatientFormSubmission,
} from '@interfaces/Form.interface';

import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import {
  usePatientFormSubmissions,
  useResendFormSubmission,
} from '@store/Form.store';

import Can from '@components/Can/Can';
import InitialsAvatar from '@components/InitialsAvatar';

type TStatusConfig = {
  icon: LucideIcon;
  bg: string;
  text: string;
  label: string;
};

const STATUS: Record<TFormSubmissionStatus, TStatusConfig> = {
  ANSWERED: {
    icon: CheckCircle2,
    bg: 'bg-green-100',
    text: 'text-green-600',
    label: 'Concluído',
  },
  PENDING: {
    icon: Clock,
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    label: 'Pendente',
  },
  EXPIRED: {
    icon: CircleAlert,
    bg: 'bg-red-100',
    text: 'text-red-600',
    label: 'Expirado',
  },
};

type TPatientFormsProps = {
  patientId: string;
};

const PatientForms: React.FC<TPatientFormsProps> = ({ patientId }) => {
  const { notify } = useNotificationContext();

  const { data: submissions = [], isLoading } =
    usePatientFormSubmissions(patientId);

  const {
    mutate: resend,
    isPending,
    variables: resendingId,
  } = useResendFormSubmission();

  const handleResend = (id: string) =>
    resend(id, {
      onSuccess: () =>
        notify({
          type: 'success',
          title: 'Formulário reenviado',
          description: 'O paciente receberá o link novamente por e-mail.',
        }),
      onError: (err) =>
        notify({
          type: 'error',
          title: 'Não foi possível reenviar',
          description: getApiError(
            err,
            'Não foi possível reenviar o formulário',
          ),
        }),
    });

  const columns: TableProps<TPatientFormSubmission>['columns'] = [
    {
      title: 'Formulário',
      dataIndex: 'formName',
      key: 'formName',
      render: (value: string | null, record) => {
        const config = STATUS[record.status];
        const Icon = config.icon;

        return (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bg} ${config.text}`}
            >
              <Icon size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{value ?? '—'}</span>
              <span className={`text-xs ${config.text}`}>{config.label}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Enviado por',
      dataIndex: 'professionalName',
      key: 'professionalName',
      render: (value: string | null) =>
        value ? (
          <div className="flex items-center gap-2">
            <InitialsAvatar name={value} size={28} />
            <span>{value}</span>
          </div>
        ) : (
          '—'
        ),
    },
    {
      title: 'Enviado em',
      dataIndex: 'sentAt',
      key: 'sentAt',
      className: 'w-0 whitespace-nowrap',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'center',
      className: 'w-0 whitespace-nowrap',
      render: (_, record) => (
        <Can permission={PERMISSIONS.FORM_SEND}>
          <Tooltip
            title={
              record.status === 'ANSWERED' ? 'Formulário já respondido' : ''
            }
          >
            <Button
              icon={<Send size={14} />}
              disabled={record.status === 'ANSWERED'}
              loading={isPending && resendingId === record.id}
              onClick={() => handleResend(record.id)}
            >
              Reenviar
            </Button>
          </Tooltip>
        </Can>
      ),
    },
  ];

  return (
    <Card classNames={{ body: 'p-0! overflow-hidden' }}>
      <Table<TPatientFormSubmission>
        dataSource={submissions}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        columns={columns}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Este paciente ainda não recebeu formulários."
            />
          ),
        }}
      />
    </Card>
  );
};

export default PatientForms;
