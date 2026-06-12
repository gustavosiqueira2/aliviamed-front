import dayjs from 'dayjs';

import { Empty, List, Skeleton, theme, Typography } from 'antd';
import { Clipboard, Siren, Undo2 } from 'lucide-react';

import { usePatientConsultHistory } from '@store/Patient.store';
import { type TConsult } from '@interfaces/Consult.interface';

const { Text } = Typography;

type TPreviousConsultsListProps = {
  patientId?: string;
  currentConsultId?: string;
  limit?: number;
  onSelect: (consult: TConsult) => void;
};

const PreviousConsultsList: React.FC<TPreviousConsultsListProps> = (props) => {
  const { patientId, currentConsultId, limit, onSelect } = props;

  const {
    token: { colorPrimary, colorInfo, colorError },
  } = theme.useToken();

  const typeMeta = {
    DEFAULT: { Icon: Clipboard, color: colorPrimary },
    RETURN: { Icon: Undo2, color: colorInfo },
    URGENT: { Icon: Siren, color: colorError },
  } as const;

  const { data, isLoading } = usePatientConsultHistory(patientId);

  const consults = (data ?? [])
    .filter((c) => !currentConsultId || c.id !== currentConsultId)
    .sort(
      (a, b) =>
        dayjs(b.finishedAt ?? b.startedAt).valueOf() -
        dayjs(a.finishedAt ?? a.startedAt).valueOf(),
    )
    .slice(0, limit);

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (consults.length === 0) {
    return (
      <div className="m-4 flex flex-1 items-center justify-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Esse paciente não possui consultas anteriores"
        />
      </div>
    );
  }

  return (
    <List
      className="max-h-[70vh] overflow-auto"
      dataSource={consults}
      rowKey="id"
      renderItem={(consult) => {
        const date = dayjs(consult.finishedAt ?? consult.startedAt);
        const summary = consult.diagnosis || consult.notes;
        const { Icon, color } =
          typeMeta[consult.appointment.type] ?? typeMeta.DEFAULT;

        return (
          <List.Item
            className="cursor-pointer px-4! py-3! transition-opacity hover:opacity-85"
            onClick={() => onSelect(consult)}
          >
            <div className="flex w-full items-center gap-3">
              <div
                style={{ background: color + '15' }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              >
                <Icon size={18} style={{ color }} />
              </div>

              <div className="flex shrink-0 flex-col whitespace-nowrap">
                <Text className="text-xs!">{date.format('DD/MM/YYYY')}</Text>
                <Text type="secondary" className="text-xs!">
                  {date.format('HH:mm')}
                </Text>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <Text strong className="truncate text-sm!">
                  {consult.professional.name}
                </Text>
                <Text
                  type="secondary"
                  className={`line-clamp-1 text-xs! ${summary ? '' : 'italic'}`}
                >
                  {summary || 'Sem anotações registradas'}
                </Text>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};

export default PreviousConsultsList;
