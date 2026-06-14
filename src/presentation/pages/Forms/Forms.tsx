import { useRef, useState } from 'react';

import dayjs from 'dayjs';

import { Link } from 'react-router';

import {
  Button,
  Card,
  Empty,
  Input,
  Progress,
  Segmented,
  Select,
  Table,
  Tooltip,
  Tour,
  Typography,
  type TableProps,
  type TourProps,
} from 'antd';
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  Pencil,
  Plus,
  Search,
  Send,
} from 'lucide-react';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import type { TForm } from '@interfaces/Form.interface';

import { usePermissions } from '@hooks/usePermissions';
import { useDebounce } from '@hooks/useDebounce';

import { useAuth } from '@store/Auth.store';
import { useForm, useForms } from '@store/Form.store';

import FadeWrapper from '@components/FadeWrapper';
import Can from '@components/Can/Can';
import InitialsAvatar from '@components/InitialsAvatar';

import FormPreview from '@components/FormPreview';
import SendFormModal from '@components/Modal/SendFormModal';

const { Title, Paragraph } = Typography;

const GREEN = '#4ade80';
const ORANGE = '#f59e0b';

type TFilter = 'all' | 'pending' | 'done';

type TStatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
  divider?: boolean;
};

const StatCard = ({ icon, label, value, hint, divider }: TStatCardProps) => (
  <div className={divider ? 'sm:border-l sm:border-white/15 sm:pl-8' : ''}>
    <div className="mb-1 flex items-center gap-2 text-sm text-white/80">
      {icon}
      {label}
    </div>
    <div className="text-3xl leading-none font-bold">{value}</div>
    <div className="mt-1.5 text-xs text-white/70">{hint}</div>
  </div>
);

type TResponseRateProps = {
  sent: number;
  answered: number;
  pending: number;
};

const ResponseRate = ({ sent, answered, pending }: TResponseRateProps) => {
  const pct = sent ? Math.round((answered / sent) * 100) : 0;

  const pctColor =
    sent === 0
      ? 'text-gray-300'
      : pct === 100
        ? 'text-green-500'
        : 'text-gray-600';

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-3 text-gray-500">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: GREEN }}
            />
            {answered} resp.
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: ORANGE }}
            />
            {pending} pend.
          </span>
        </span>
        <span className={`font-semibold ${pctColor}`}>{pct}%</span>
      </div>

      <Progress
        percent={sent ? 100 : 0}
        success={{ percent: pct, strokeColor: GREEN }}
        strokeColor={ORANGE}
        showInfo={false}
        size="small"
      />
    </div>
  );
};

const tabLabel = (text: string, count: number) => (
  <span className="flex items-center gap-2">
    {text}
    <span className="text-xs opacity-60">{count}</span>
  </span>
);

const Forms = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const { data: auth } = useAuth();
  const { hasPermission } = usePermissions();

  const canViewAll = hasPermission(PERMISSIONS.FORM_VIEW_ALL);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const { data: previewForm, isLoading: isPreviewLoading } = useForm(previewId);

  const [sendTarget, setSendTarget] = useState<{ form: TForm | null } | null>(
    null,
  );

  const [search, setSearch] = useState('');
  const [professionalFilter, setProfessionalFilter] = useState<string | null>(
    null,
  );
  const [filter, setFilter] = useState<TFilter>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 400);

  const { data: response, isLoading } = useForms({
    page,
    limit,
    search: debouncedSearch,
    professionalId: professionalFilter,
    status: filter,
  });

  const forms = response?.data ?? [];
  const summary = response?.summary;

  const professionalOptions = (response?.professionals ?? []).map(
    (professional) => ({ value: professional.id, label: professional.name }),
  );

  const [open] = useState(false);

  // O resumo e os contadores refletem sempre o total da clinica (vem do
  // backend), independente dos filtros aplicados na lista.
  const totals = {
    sent: summary?.sent ?? 0,
    answered: summary?.answered ?? 0,
    pending: summary?.pending ?? 0,
  };
  const totalForms = summary?.forms ?? 0;
  const counts = summary?.counts ?? { all: 0, pending: 0, done: 0 };

  const conversao = totals.sent
    ? Math.round((totals.answered / totals.sent) * 100)
    : 0;
  const aguardando = totals.sent
    ? Math.round((totals.pending / totals.sent) * 100)
    : 0;

  // Volta para a primeira pagina sempre que um filtro muda.
  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const onProfessionalChange = (value: string | null) => {
    setProfessionalFilter(value);
    setPage(1);
  };
  const onFilterChange = (value: TFilter) => {
    setFilter(value);
    setPage(1);
  };

  const hasActiveFilters = !!search || !!professionalFilter;
  const clearFilters = () => {
    setSearch('');
    setProfessionalFilter(null);
    setPage(1);
  };

  const columns: TableProps<TForm>['columns'] = [
    {
      title: 'Formulário',
      dataIndex: 'name',
      key: 'name',
      render: (value: string, record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <ClipboardList size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{value}</span>
            <span className="text-xs text-gray-400">
              {record.fields} {record.fields === 1 ? 'campo' : 'campos'}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Profissional',
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
      title: 'Criado em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Taxa de resposta',
      key: 'rate',
      width: 260,
      render: (_, record) => (
        <ResponseRate
          sent={record.sent}
          answered={record.answered}
          pending={record.pending}
        />
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 320,
      align: 'right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            icon={<Eye size={14} />}
            onClick={() => setPreviewId(record.id)}
          >
            Preview
          </Button>
          <Can permission={PERMISSIONS.FORM_SEND}>
            <Button
              type="primary"
              icon={<Send size={14} />}
              onClick={() => setSendTarget({ form: record })}
            >
              Enviar
            </Button>
          </Can>
          <Tooltip title="Em breve">
            <Button icon={<Pencil size={14} />} disabled>
              Editar
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const steps: TourProps['steps'] = [
    {
      title: 'Formulários',
      description:
        'Aqui você vai encontrar os formulários que você pode mandar para seus pacientes!',
      target: () => ref1.current,
    },
    {
      title: 'Criar o primeiro',
      description: (
        <>
          Vamos criar o seu primeiro Formulário.{' '}
          <span className="text-gray-500">(clique em Novo formulário)</span>
        </>
      ),
      target: () => ref2.current,
      nextButtonProps: { className: 'hidden!' },
    },
  ];

  return (
    <FadeWrapper>
      <Tour open={open} closable={false} steps={steps} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col">
          <Title level={2} className="mb-1!">
            Formulários
          </Title>
          <Paragraph className="mb-1!">
            Crie e gerencie formulários para coletar informações dos pacientes.
            Acompanhe envios, respostas e pendências em um só lugar.
          </Paragraph>
        </div>

        <div className="flex items-center gap-2">
          <Can permission={PERMISSIONS.FORM_CREATE}>
            <Link to={ROUTE_NAMES.NEW_FORM}>
              <Button ref={ref2} icon={<Plus size={16} />}>
                Novo formulário
              </Button>
            </Link>
          </Can>

          <Can permission={PERMISSIONS.FORM_SEND}>
            <Button
              type="primary"
              icon={<Send size={16} />}
              onClick={() => setSendTarget({ form: null })}
            >
              Enviar formulário
            </Button>
          </Can>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-4">
        <div
          className="overflow-hidden rounded-2xl px-8 py-6 text-white"
          style={{
            background:
              'radial-gradient(circle at 85% 25%, rgba(255,255,255,0.18), transparent 45%), linear-gradient(120deg, #8b5cf6 0%, #7c3aed 60%, #6d28d9 100%)',
          }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatCard
              icon={<Send size={15} />}
              label="Enviados"
              value={totals.sent}
              hint={`${totalForms} ${totalForms === 1 ? 'formulário' : 'formulários'}`}
            />
            <StatCard
              divider
              icon={<CheckCircle2 size={15} />}
              label="Respondidos"
              value={totals.answered}
              hint={`${conversao}% de conversão`}
            />
            <StatCard
              divider
              icon={<Clock size={15} />}
              label="Pendentes"
              value={totals.pending}
              hint={`${aguardando}% aguardando`}
            />
          </div>
        </div>

        <Card variant="borderless" classNames={{ body: 'p-2!' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input
                allowClear
                prefix={<Search size={16} className="text-gray-400" />}
                placeholder="Buscar formulário..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="max-w-md"
              />

              {canViewAll && (
                <Select
                  allowClear
                  showSearch={{ optionFilterProp: 'label' }}
                  placeholder="Filtrar por profissional"
                  value={professionalFilter}
                  onChange={(value) => onProfessionalChange(value ?? null)}
                  options={professionalOptions}
                  className="min-w-56"
                />
              )}

              <Button disabled={!hasActiveFilters} onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>

            <Segmented<TFilter>
              value={filter}
              onChange={onFilterChange}
              options={[
                { label: tabLabel('Todos', counts.all), value: 'all' },
                {
                  label: tabLabel('Com pendências', counts.pending),
                  value: 'pending',
                },
                { label: tabLabel('Concluídos', counts.done), value: 'done' },
              ]}
            />
          </div>
        </Card>
        <Card
          ref={ref1}
          variant="borderless"
          className="overflow-hidden"
          classNames={{ body: 'p-0!' }}
        >
          <Table<TForm>
            dataSource={forms}
            rowKey="id"
            loading={isLoading}
            columns={columns}
            pagination={{
              current: page,
              pageSize: limit,
              total: response?.meta.total ?? 0,
              showSizeChanger: true,
              showTotal: (total) =>
                `${total} ${total === 1 ? 'formulário' : 'formulários'}`,
              onChange: (nextPage, nextLimit) => {
                setPage(nextPage);
                setLimit(nextLimit);
              },
            }}
            locale={{
              emptyText: <Empty description="Nenhum formulário encontrado" />,
            }}
          />
        </Card>
      </div>

      <FormPreview
        open={!!previewId}
        onClose={() => setPreviewId(null)}
        loading={isPreviewLoading}
        clinicName={auth?.clinicProfile?.clinic.name}
        groups={previewForm?.schema ?? []}
      />

      <SendFormModal
        open={!!sendTarget}
        initialForm={sendTarget?.form ?? undefined}
        onCancel={() => setSendTarget(null)}
      />
    </FadeWrapper>
  );
};

export default Forms;
