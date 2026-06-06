import dayjs from 'dayjs';

import { Drawer, Typography } from 'antd';

import type { TConsult } from '@interfaces/Consult.interface';

const { Title, Text } = Typography;

const FIELDS: {
  key: 'complaint' | 'evolution' | 'diagnosis' | 'prescription' | 'notes';
  label: string;
}[] = [
  { key: 'complaint', label: 'Motivo da consulta' },
  { key: 'evolution', label: 'Evolução clínica' },
  { key: 'diagnosis', label: 'Diagnóstico' },
  { key: 'prescription', label: 'Prescrição' },
  { key: 'notes', label: 'Observações' },
];

type TConsultDetailDrawerProps = {
  consult: TConsult | null;
  open: boolean;
  onClose: () => void;
};

const ConsultDetailDrawer: React.FC<TConsultDetailDrawerProps> = (props) => {
  const { consult, open, onClose } = props;

  return (
    <Drawer
      width={480}
      placement="right"
      open={open}
      onClose={onClose}
      title="Consulta anterior"
    >
      {consult && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Text>
              {dayjs(consult.finishedAt ?? consult.startedAt).format(
                'DD/MM/YYYY [às] HH:mm',
              )}
            </Text>
            <span>Profissional: {consult.professional.name}</span>
          </div>

          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <Title level={5} className="mb-1!">
                {label}
              </Title>
              <Text className="wrap-break-words! text-sm! whitespace-pre-wrap!">
                {consult[key] || 'Não informado'}
              </Text>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default ConsultDetailDrawer;
