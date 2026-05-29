import dayjs from 'dayjs';

import { Empty, List, Skeleton } from 'antd';

import { usePatientConsultHistory } from '@store/PatientStore';
import { type TGetConsultApiReturn } from '@store/Consult';

type TPreviousConsultsListProps = {
  patientId?: string;
  currentConsultId?: string;
  onSelect: (consult: TGetConsultApiReturn) => void;
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
          className="cursor-pointer px-4! py-2! transition-colors hover:bg-gray-50"
          onClick={() => onSelect(consult)}
        >
          <List.Item.Meta
            title={dayjs(consult.finishedAt).format('DD/MM/YYYY [às] HH:mm')}
            description={
              <span className="flex flex-col">
                <span className="text-xs text-gray-400">
                  {consult.professional.name}
                </span>
                <span className="line-clamp-2 text-xs text-gray-500">
                  {consult.diagnosis ||
                    consult.complaint ||
                    'Sem anotações registradas'}
                </span>
              </span>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default PreviousConsultsList;
