import dayjs from 'dayjs';

import { Button, Card, Divider, Typography } from 'antd';
import {
  IdCard,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from 'lucide-react';

import type { TPatient } from '@interfaces/Patient.interface';

import { calculateAge } from '@functions/calculateAge';
import { translateSex } from '@functions/translateSex';

import InitialsAvatar from '@components/InitialsAvatar';
import { formatDocument } from '@functions/formatDocument';

const { Title, Text } = Typography;

type TPatientInformationProps = {
  patient: TPatient;
};

const PatientInformation: React.FC<TPatientInformationProps> = (props) => {
  const { patient } = props;

  const age = calculateAge(patient.birthdate);

  const subtitle = [
    age !== null ? `${age} anos` : null,
    translateSex(patient.sex) || null,
    dayjs(patient.birthdate).format('DD/MM/YYYY'),
  ]
    .filter(Boolean)
    .join(' · ');

  const phoneDigits = patient.phone?.replace(/\D/g, '');
  const contactRows: { icon: LucideIcon; title: string; sub?: string }[] = [
    { icon: IdCard, title: 'Documento', sub: formatDocument(patient.document) },
    ...(patient.phone
      ? [
          {
            icon: Phone,
            title: patient.phone,
            sub: patient.emergencyPhone
              ? `emerg.: ${patient.emergencyPhone}`
              : undefined,
          },
        ]
      : []),
    ...(patient.email
      ? [{ icon: Mail, title: 'Email', sub: patient.email }]
      : []),
  ];

  return (
    <Card classNames={{ body: 'p-5!' }}>
      <div className="flex flex-col items-center text-center">
        <InitialsAvatar name={patient.name} size={72} fontSize={24} shadow />

        <Title level={4} className="mt-3! mb-0!">
          {patient.name}
        </Title>

        <Text type="secondary" className="text-xs!">
          {subtitle}
        </Text>
      </div>

      <Divider className="my-4!" />

      <div className="flex flex-col gap-3">
        {contactRows.map(({ icon: Icon, title: value, sub }) => (
          <div key={value} className="flex items-center gap-3">
            <Icon size={18} className="mt-0.5 shrink-0 text-gray-400" />
            <div className="flex min-w-0 flex-col">
              <Text className="text-[11px]! font-semibold! wrap-break-word">
                {value}
              </Text>

              {sub && (
                <Text type="secondary" className="text-xs!">
                  {sub}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>

      {(phoneDigits || patient.email) && (
        <>
          <Divider className="my-4!" />

          <div className="grid grid-cols-3 gap-2">
            {phoneDigits && (
              <Button
                className={`flex-col gap-1! rounded-xl! py-7! text-xs! hover:bg-purple-500/5!`}
                href={`tel:${phoneDigits}`}
                icon={<Phone size={12} />}
              >
                Ligar
              </Button>
            )}
            {phoneDigits && (
              <Button
                className={`flex-col gap-1! rounded-xl! py-7! text-xs! hover:bg-purple-500/5!`}
                href={`https://wa.me/55${phoneDigits}`}
                target="_blank"
                icon={<MessageCircle size={16} />}
              >
                WhatsApp
              </Button>
            )}
            {patient.email && (
              <Button
                className={`flex-col gap-1! rounded-xl! py-7! text-xs! hover:bg-purple-500/5!`}
                href={`mailto:${patient.email}`}
                icon={<Mail size={16} />}
              >
                E-mail
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default PatientInformation;
