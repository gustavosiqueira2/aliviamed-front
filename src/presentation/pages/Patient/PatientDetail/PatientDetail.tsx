import { useState, type ReactNode } from 'react';

import dayjs from 'dayjs';

import { Link, useNavigate, useParams } from 'react-router';

import { Calendar, SquarePen } from 'lucide-react';
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Skeleton,
  Tabs,
  theme,
  Typography,
} from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import { type TConsult } from '@interfaces/Consult.interface';

import { usePatient, usePatientConsultHistory } from '@store/Patient.store';

import { usePermissions } from '@hooks/usePermissions';

import PreviousConsultsList from '@components/Consult/PreviousConsultsList';
import ConsultDetailDrawer from '@components/Consult/ConsultDetailDrawer';
import FadeWrapper from '@components/FadeWrapper';
import Can from '@components/Can/Can';

import PatientInformation from './components/PatientInformation';
import PatientOverview from './components/PatientOverview';
import PatientFinancial from './components/PatientFinancial';
import { usePatientFinancial } from '@store/Financial.store';

const { Title, Text } = Typography;

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConsult, setSelectedConsult] = useState<TConsult | null>(null);

  const { data: patient, isLoading: loadingPatient } = usePatient(patientId!);
  const { data: financial, isLoading: loadingFinancial } =
    usePatientFinancial(patientId);

  const { hasPermission } = usePermissions();
  const canViewConsults = hasPermission(PERMISSIONS.CONSULT_VIEW);
  const canViewFinancial = hasPermission(PERMISSIONS.FINANCIAL_VIEW);

  const { data: consultHistory } = usePatientConsultHistory(
    canViewConsults ? patientId : undefined,
  );

  if (loadingPatient || !patient || loadingFinancial || !financial) {
    return (
      <FadeWrapper>
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </FadeWrapper>
    );
  }

  const consultDates = (consultHistory ?? [])
    .map((c) => dayjs(c.finishedAt ?? c.startedAt))
    .sort((a, b) => a.valueOf() - b.valueOf());
  const consultCount = consultHistory?.length ?? 0;
  const firstConsult = consultDates[0];

  const tabItems: { key: string; label: ReactNode; children: ReactNode }[] = [
    {
      key: 'overview',
      label: 'Visão geral',
      children: (
        <PatientOverview
          patientId={patient.id}
          financialValue={financial.summary.received}
          firstConsult={firstConsult}
          consultCount={consultCount}
          canViewConsults={canViewConsults}
          canViewFinancial={canViewFinancial}
          onSeeConsults={() => setActiveTab('consults')}
          onSeeFinancial={() => setActiveTab('financial')}
          onSelectConsult={(c) => setSelectedConsult(c)}
        />
      ),
    },
  ];

  if (canViewConsults) {
    tabItems.push({
      key: 'consults',
      label: consultCount ? `Consultas (${consultCount})` : 'Consultas',
      children: (
        <Card classNames={{ body: 'p-0!' }}>
          <PreviousConsultsList
            patientId={patientId}
            onSelect={setSelectedConsult}
          />
        </Card>
      ),
    });
  }

  if (canViewFinancial) {
    tabItems.push({
      key: 'financial',
      label: 'Financeiro',
      children: (
        <PatientFinancial financial={financial} loading={loadingFinancial} />
      ),
    });
  }

  return (
    <FadeWrapper>
      <Breadcrumb
        className="mb-2"
        items={[
          {
            title: 'Pacientes',
            className: 'cursor-pointer',
            onClick: () => navigate(ROUTE_NAMES.PATIENTS),
          },
          { title: patient.name },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <Title level={2} className="mb-0!">
          Ficha do paciente
        </Title>

        <Can permission={PERMISSIONS.PATIENT_UPDATE}>
          <Link to={`${ROUTE_NAMES.PATIENTS}/update/${patientId}`}>
            <Button type="primary" icon={<SquarePen size={16} />}>
              Editar ficha
            </Button>
          </Link>
        </Can>
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="lg:w-80 lg:shrink-0">
          <PatientInformation patient={patient} />

          <Alert
            style={{
              borderColor: colorPrimary + '40',
              background: colorPrimary + '10',
            }}
            className="mt-4!"
            title={
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Calendar style={{ color: colorPrimary }} size={16} />

                  <Text
                    style={{ color: colorPrimary }}
                    className="font-semibold!"
                  >
                    Proxima consulta
                  </Text>
                </div>

                <Title level={5} className="mt-2! mb-0!">
                  22 jun · 14:00
                </Title>
                <Text type="secondary">Dra. Helena Dias · Retorno</Text>
              </div>
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </div>
      </div>

      <ConsultDetailDrawer
        consult={selectedConsult}
        open={!!selectedConsult}
        onClose={() => setSelectedConsult(null)}
      />
    </FadeWrapper>
  );
};

export default PatientDetail;
