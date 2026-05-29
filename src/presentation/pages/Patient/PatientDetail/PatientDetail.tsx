import { Link, useNavigate, useParams } from 'react-router';

import { Avatar, Breadcrumb, Button, Card, Typography } from 'antd';
import { UserRound } from 'lucide-react';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { usePatient } from '@store/PatientStore';

const { Title, Paragraph } = Typography;

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const { data: patient } = usePatient(patientId!);

  if (!patient) return;

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
        <Title level={2}>Ficha do Paciente</Title>

        <Link to={`${ROUTE_NAMES.PATIENTS}/update/${patientId}`}>
          <Button type="primary">Editar ficha</Button>
        </Link>
      </div>

      <Card className="mt-2!">
        <div className="flex items-center gap-4">
          <Avatar size={64} className="bg-blue-200/50!">
            <UserRound size={32} className="text-blue-500" />
          </Avatar>

          <div className="flex flex-col">
            <Title level={3} className="my-0!">
              {patient.name}
            </Title>
            <Paragraph className="my-0!">
              Data de Nascimento: {patient?.birthdate.toLocaleDateString()}
            </Paragraph>
          </div>
        </div>
      </Card>
    </>
  );
};

export default PatientDetail;
