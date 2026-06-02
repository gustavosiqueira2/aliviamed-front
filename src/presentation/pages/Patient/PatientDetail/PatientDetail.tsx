import { useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router';

import dayjs from 'dayjs';

import { Avatar, Breadcrumb, Button, Card, Typography } from 'antd';
import { UserRound } from 'lucide-react';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import { calculateAge } from '@functions/calculateAge';
import { translateSex } from '@functions/translateSex';
import { formatDocument } from '@functions/formatDocument';

import { usePatient } from '@store/PatientStore';
import { type TGetConsultApiReturn } from '@store/Consult';

import Can from '@components/Can/Can';
import PreviousConsultsList from '@components/Consult/PreviousConsultsList';
import ConsultDetailDrawer from '@components/Consult/ConsultDetailDrawer';

const { Title, Paragraph } = Typography;

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const { data: patient } = usePatient(patientId!);

  const [selectedConsult, setSelectedConsult] =
    useState<TGetConsultApiReturn | null>(null);

  if (!patient) return;

  const age = calculateAge(patient.birthdate);

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Pacientes',
            className: 'cursor-pointer',
            onClick: () => navigate(ROUTE_NAMES.PATIENTS),
          },
          { title: 'Detalhes' },
        ]}
      />

      <div className="flex items-center justify-between">
        <Title level={2} className="mb-0!">
          Ficha do Paciente
        </Title>

        <Can permission={PERMISSIONS.PATIENT_UPDATE}>
          <Link to={`${ROUTE_NAMES.PATIENTS}/update/${patientId}`}>
            <Button type="primary">Editar ficha</Button>
          </Link>
        </Can>
      </div>

      <Card className="mt-2!">
        <div className="flex items-center gap-4">
          <Avatar size={64} className="bg-blue-200!">
            <UserRound size={32} className="text-blue-500" />
          </Avatar>

          <div className="flex flex-col">
            <Title level={3} className="my-0!">
              {patient.name}
            </Title>
            <Paragraph className="my-0!">
              {age !== null && `${age} anos · `}Data de Nascimento:{' '}
              {dayjs(patient.birthdate).format('DD/MM/YYYY')}
            </Paragraph>
            {patient.sex && (
              <Paragraph className="my-0!">
                Sexo: {translateSex(patient.sex)}
              </Paragraph>
            )}
            {patient.document && (
              <Paragraph className="my-0!">
                CPF: {formatDocument(patient.document)}
              </Paragraph>
            )}
            {patient.phone && (
              <Paragraph className="my-0!">Telefone: {patient.phone}</Paragraph>
            )}
            {patient.email && (
              <Paragraph className="my-0!">E-mail: {patient.email}</Paragraph>
            )}
          </div>
        </div>
      </Card>

      <Can permission={PERMISSIONS.CONSULT_VIEW}>
        <Card
          className="mt-4!"
          classNames={{ body: 'flex flex-col p-0! pb-4' }}
        >
          <div className="p-4 pb-0">
            <Title level={4} className="my-0!">
              Histórico de consultas
            </Title>
          </div>

          <PreviousConsultsList
            patientId={patientId}
            onSelect={setSelectedConsult}
          />
        </Card>
      </Can>

      <ConsultDetailDrawer
        consult={selectedConsult}
        open={!!selectedConsult}
        onClose={() => setSelectedConsult(null)}
      />
    </>
  );
};

export default PatientDetail;
