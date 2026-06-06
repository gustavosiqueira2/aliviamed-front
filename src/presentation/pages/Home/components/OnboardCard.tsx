import type { ComponentProps } from 'react';

import { Link } from 'react-router';

import { Button, Card, Steps, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

const { Title, Paragraph } = Typography;

const items: (step: number) => ComponentProps<typeof Steps>['items'] = (
  step,
) => [
  {
    title: (
      <span className={step === 0 ? 'font-bold' : ''}>Primeira Anamnese</span>
    ),
    content: (
      <div className="flex flex-col gap-2">
        Crie sua primeira anamnese ou formulário para coletar informações dos
        pacientes. Personalize os campos de acordo com sua necessidade e comece
        a estruturar seus atendimentos.
        {step === 0 && (
          <Link to={ROUTE_NAMES.FORMS}>
            <Button className="w-fit">Criar a primeira anamnese</Button>
          </Link>
        )}
      </div>
    ),
  },
  {
    title: (
      <span className={step === 1 ? 'font-bold' : ''}>Eventos e ações</span>
    ),
    content: (
      <div className="flex flex-col gap-2">
        Configure seu primeiro gatilho para automatizar ações no sistema. Defina
        quando ele deve ser acionado e quais ações serão executadas, como envio
        de mensagens ou atualizações no fluxo.
        {step === 1 && <Button className="w-fit">Configurar os eventos</Button>}
      </div>
    ),
  },
  {
    title: 'Paciente',
    content:
      'Cadastre seu primeiro paciente e comece a utilizar o sistema na prática. Adicione as informações iniciais e inicie o acompanhamento dentro do seu fluxo de atendimento.',
  },
];

const OnboardCard = () => {
  return (
    <Card variant="borderless" classNames={{ body: 'pt-3.5!' }}>
      <Title level={3} className="mb-1!">
        Onboarding
      </Title>
      <Paragraph>
        Dê início à sua operação com uma configuração guiada. Acesse e configure
        os principais recursos, como cadastros iniciais, gatilhos e automações,
        tudo em um único lugar.
      </Paragraph>

      <Steps orientation="vertical" current={0} items={items(0)} size="small" />
    </Card>
  );
};

export default OnboardCard;
