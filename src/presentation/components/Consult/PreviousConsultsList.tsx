import dayjs from 'dayjs';

import { Empty, List, Skeleton, Typography } from 'antd';

import { usePatientConsultHistory } from '@store/Patient.store';
import { type TConsult } from '@interfaces/Consult.interface';

const { Text } = Typography;

type TPreviousConsultsListProps = {
  patientId?: string;
  currentConsultId?: string;
  onSelect: (consult: TConsult) => void;
};

const PreviousConsultsList: React.FC<TPreviousConsultsListProps> = (props) => {
  const { patientId, currentConsultId, onSelect } = props;

  const { data, isLoading } = usePatientConsultHistory(patientId);

  const consults = (data ?? []).filter(
    (c) => !currentConsultId || c.id !== currentConsultId,
  );

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
      renderItem={(consult) => (
        <List.Item
          className="cursor-pointer px-4! py-2! transition-opacity hover:opacity-85"
          onClick={() => onSelect(consult)}
        >
          <List.Item.Meta
            title={dayjs(consult.finishedAt).format('DD/MM/YYYY [às] HH:mm')}
            description={
              <span className="flex flex-col">
                <Text className="text-xs! font-semibold!">
                  {consult.professional.name}
                </Text>
                <Text className="line-clamp-2 text-xs!">
                  {consult.diagnosis ||
                    consult.complaint ||
                    'Sem anotações registradas'}
                </Text>
              </span>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default PreviousConsultsList;
