import { useState } from 'react';

import { Link } from 'react-router';

import type { Dayjs } from 'dayjs';

import { Button, Card, Empty, theme, Typography } from 'antd';
import {
  Calendar,
  CreditCard,
  FileInput,
  FileText,
  SquarePen,
} from 'lucide-react';

import { PERMISSIONS } from '@constants/PERMISSIONS';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import type { TConsult } from '@interfaces/Consult.interface';

import { formatCurrency } from '@functions/formatCurrency';

import PreviousConsultsList from '@components/Consult/PreviousConsultsList';
import Can from '@components/Can/Can';
import SendFormModal from '@components/Modal/SendFormModal';

const { Title, Text } = Typography;

type TPatientOverviewProps = {
  patientId: string;
  patientName: string;
  financialValue?: number;
  firstConsult: Dayjs;
  consultCount: number;
  canViewConsults: boolean;
  canViewFinancial: boolean;
  onSeeConsults: () => void;
  onSeeFinancial: () => void;
  onSelectConsult: (consult: TConsult) => void;
};

const PatientOverview: React.FC<TPatientOverviewProps> = (props) => {
  const {
    patientId,
    patientName,
    financialValue,
    firstConsult,
    consultCount,
    canViewConsults,
    canViewFinancial,
    onSeeConsults,
    onSeeFinancial,
    onSelectConsult,
  } = props;

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [sendFormOpen, setSendFormOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Can permission={PERMISSIONS.PATIENT_UPDATE}>
          <Link to={`${ROUTE_NAMES.PATIENTS}/update/${patientId}`}>
            <Button type="primary" icon={<SquarePen size={15} />}>
              Editar ficha
            </Button>
          </Link>
        </Can>
        <Can permission={PERMISSIONS.FORM_SEND}>
          <Button
            icon={<FileInput size={15} />}
            onClick={() => setSendFormOpen(true)}
          >
            Enviar formulário
          </Button>
        </Can>
        <Can permission={PERMISSIONS.PATIENT_UPDATE}>
          <Link to={`${ROUTE_NAMES.PATIENTS}/update/${patientId}`}>
            <Button icon={<FileText size={15} />}>Adicionar documentos</Button>
          </Link>
        </Can>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {canViewConsults && (
          <>
            <Card classNames={{ body: 'p-4!' }}>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} style={{ color: colorPrimary }} />

                    <Title level={5} className="my-0! text-sm!">
                      Consultas
                    </Title>
                  </div>

                  <Text
                    style={{ color: colorPrimary }}
                    className="cursor-pointer hover:underline"
                    onClick={onSeeConsults}
                  >
                    ver →
                  </Text>
                </div>

                <div className="flex flex-col">
                  <Text className="text-2xl!">{consultCount}</Text>
                  <Text type="secondary">concluídas</Text>
                </div>
              </div>
            </Card>
            <Card classNames={{ body: 'p-4!' }}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} style={{ color: colorPrimary }} />

                  <Title level={5} className="my-0! text-sm!">
                    Primeira consulta
                  </Title>
                </div>

                <div className="flex flex-col">
                  <Text className="text-2xl!">
                    {firstConsult ? firstConsult.format('DD/MM/YYYY') : '—'}
                  </Text>
                </div>
              </div>
            </Card>
          </>
        )}

        {canViewFinancial && (
          <Card classNames={{ body: 'p-4!' }}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={14} className="text-amber-500" />

                  <Title level={5} className="my-0! text-sm!">
                    Financeiro
                  </Title>
                </div>

                <Text
                  style={{ color: colorPrimary }}
                  className="cursor-pointer hover:underline"
                  onClick={onSeeFinancial}
                >
                  ver →
                </Text>
              </div>

              {financialValue && (
                <div className="flex flex-col">
                  <Text className="text-2xl!">
                    {formatCurrency(financialValue)}
                  </Text>
                  <Text type="secondary">recebidos</Text>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {canViewConsults ? (
        <Card
          title="Últimas consultas"
          classNames={{ body: 'p-0!' }}
          extra={
            consultCount > 3 && (
              <Button type="link" className="px-0!" onClick={onSeeConsults}>
                Ver todas →
              </Button>
            )
          }
        >
          <PreviousConsultsList
            patientId={patientId}
            limit={3}
            onSelect={(c) => onSelectConsult(c)}
          />
        </Card>
      ) : (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Você não tem permissão para visualizar as consultas deste paciente."
          />
        </Card>
      )}

      <SendFormModal
        open={sendFormOpen}
        onCancel={() => setSendFormOpen(false)}
        initialPatient={{ id: patientId, name: patientName }}
      />
    </div>
  );
};

export default PatientOverview;
