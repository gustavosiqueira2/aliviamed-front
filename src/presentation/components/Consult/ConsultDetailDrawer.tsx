import dayjs from 'dayjs';

import { Drawer, Typography } from 'antd';

import type { TGetConsultApiReturn } from '@store/Consult';

const { Title } = Typography;

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
  consult: TGetConsultApiReturn | null;
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
          <div className="flex flex-col text-sm text-gray-500">
            <span>
              {dayjs(consult.finishedAt ?? consult.startedAt).format(
                'DD/MM/YYYY [às] HH:mm',
              )}
            </span>
            <span>Profissional: {consult.professional.name}</span>
          </div>

          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <Title level={5} className="mb-1!">
                {label}
              </Title>
              <div className="wrap-break-words text-sm whitespace-pre-wrap text-gray-700">
                {consult[key] || 'Não informado'}
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default ConsultDetailDrawer;
