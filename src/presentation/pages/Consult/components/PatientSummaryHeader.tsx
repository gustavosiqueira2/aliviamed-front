import dayjs from 'dayjs';

import { Avatar, Card, Typography } from 'antd';
import { Mail, Phone, UserRound } from 'lucide-react';

import { calculateAge } from '@functions/calculateAge';
import { translateSex } from '@functions/translateSex';

import Timer from '../Timer';

const { Title } = Typography;

type TSummaryPatient = {
  name: string;
  birthdate: Date | string;
  phone?: string;
  document?: string;
  sex?: string;
  email?: string;
};

type TPatientSummaryHeaderProps = {
  patient: TSummaryPatient;
  professionalName?: string;
  startedAt: Date;
};

const PatientSummaryHeader: React.FC<TPatientSummaryHeaderProps> = (props) => {
  const { patient, professionalName, startedAt } = props;

  const age = calculateAge(patient.birthdate);

  return (
    <Card classNames={{ body: 'p-4!' }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar size={64} className="bg-blue-200/50!">
            <UserRound size={32} className="text-blue-500" />
          </Avatar>

          <div className="flex flex-col gap-1">
            <Title level={4} className="my-0!">
              {patient.name}
            </Title>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>{dayjs(patient.birthdate).format('DD/MM/YYYY')}</span>
              <span>
                {age !== null ? `${age} anos` : 'Idade não informada'}
              </span>
              {patient.sex && <span>{translateSex(patient.sex)}</span>}
              {patient.document && <span>CPF: {patient.document}</span>}
            </div>

            {(patient.phone || patient.email) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {patient.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {patient.phone}
                  </span>
                )}
                {patient.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {patient.email}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {professionalName && (
            <span className="text-sm text-gray-500">
              Profissional:{' '}
              <b className="font-semibold text-gray-700">{professionalName}</b>
            </span>
          )}

          <Timer start={dayjs(startedAt)} />
        </div>
      </div>
    </Card>
  );
};

export default PatientSummaryHeader;
