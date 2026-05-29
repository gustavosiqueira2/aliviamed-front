import { useRef, useState } from 'react';

import { Link } from 'react-router';

import {
  Button,
  Card,
  Empty,
  Table,
  Tour,
  Typography,
  type TourProps,
} from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import FadeWrapper from '@components/FadeWrapper';

const { Title, Paragraph } = Typography;

const Forms = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const forms = [];

  const [open] = useState(forms.length > 0);

  const steps: TourProps['steps'] = [
    {
      title: 'Formulários',
      description:
        'Aqui você vai encontrar os formulários que você pode mandar para seus pacientes!',
      target: () => ref1.current,
    },
    {
      title: 'Criar o primeiro',
      description: (
        <>
          Vamos criar o seu primeiro Formulário.{' '}
          <span className="text-gray-500">(clique em Novo formulário)</span>
        </>
      ),
      target: () => ref2.current,
      nextButtonProps: { className: 'hidden!' },
    },
  ];

  return (
    <FadeWrapper>
      <Tour open={open} closable={false} steps={steps} />

      <Card
        ref={ref1}
        variant="borderless"
        className="overflow-hidden"
        classNames={{ body: 'p-0!' }}
      >
        <div className="flex justify-between px-6 pt-3.5">
          <div className="flex flex-col">
            <Title level={2} className="mb-1!">
              Formulário
            </Title>

            <Paragraph>
              Crie e gerencie formulários para coletar informações dos seus
              pacientes. Personalize campos, organize respostas e integre os
              dados ao seu fluxo de atendimento.
            </Paragraph>
          </div>

          <Link to={ROUTE_NAMES.NEW_FORM}>
            <Button ref={ref2} type="primary">
              Novo formulário
            </Button>
          </Link>
        </div>

        <Table
          columns={[{ title: 'Nome' }, { title: 'Entregues' }, {}]}
          locale={{
            emptyText: <Empty description="Nenhum formulário criado ainda" />,
          }}
        />
      </Card>
    </FadeWrapper>
  );
};

export default Forms;
