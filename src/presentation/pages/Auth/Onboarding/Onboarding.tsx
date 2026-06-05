import { useState } from 'react';

import { useNavigate } from 'react-router';

import { Button, Card, theme, Typography } from 'antd';
import { Hospital, Users } from 'lucide-react';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { logout } from '@store/AuthStore';

import PublicLayout from '@components/Layout/PublicLayout';

import CreateClinic from '../CreateClinic/CreateClinic';
import JoinClinic from './JoinClinic';

const { Title, Text, Paragraph } = Typography;

type TStep = 'choice' | 'create' | 'join';

type TOptionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
};

const OptionCard = ({
  icon,
  title,
  description,
  onClick,
  color,
}: TOptionCardProps) => (
  <Card
    hoverable
    variant="outlined"
    className="flex-1"
    classNames={{ body: 'flex flex-col items-center gap-3 text-center' }}
    onClick={onClick}
  >
    <div
      className="flex h-16 w-16 items-center justify-center rounded-full"
      style={{ backgroundColor: `${color}1a` }}
    >
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <Title level={4} className="mb-0!">
        {title}
      </Title>
      <Paragraph type="secondary" className="mb-0!">
        {description}
      </Paragraph>
    </div>
  </Card>
);

const Onboarding = () => {
  const navigate = useNavigate();

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [step, setStep] = useState<TStep>('choice');

  if (step === 'create') {
    return <CreateClinic onBack={() => setStep('choice')} />;
  }

  if (step === 'join') {
    return <JoinClinic onBack={() => setStep('choice')} />;
  }

  return (
    <PublicLayout>
      <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-8">
        <div className="flex w-full max-w-2xl flex-col gap-2">
          <Card>
            <div className="flex flex-col gap-1 text-center">
              <Title level={2} className="mb-0!">
                Bem-vindo ao{' '}
                <span style={{ color: colorPrimary }}>Aliviamed</span>
              </Title>
              <Text type="secondary">Como você quer começar?</Text>
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row">
              <OptionCard
                color={colorPrimary}
                icon={<Hospital size={30} color={colorPrimary} />}
                title="Criar uma clínica"
                description="Configure sua própria clínica e comece a gerenciar pacientes e agendamentos."
                onClick={() => setStep('create')}
              />
              <OptionCard
                color={colorPrimary}
                icon={<Users size={30} color={colorPrimary} />}
                title="Entrar em uma clínica"
                description="Faça parte de uma clínica que já existe através de um convite."
                onClick={() => setStep('join')}
              />
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              type="text"
              onClick={() => {
                logout();
                navigate(ROUTE_NAMES.SIGN_IN, { replace: true });
              }}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Onboarding;
