import { useState } from 'react';

import { Button, Card, Divider, Input, Steps, theme, Typography } from 'antd';

import FadeWrapper from '@components/FadeWrapper';

import ActionCard, { type TActionCardProps } from './components/ActionCard';

const { Title, Paragraph } = Typography;

const STEP_ITEMS: { title: string; content: string }[] = [
  {
    title: 'Cadastro',
    content: 'Ao incluir paciente no sistema.',
  },
  {
    title: 'Pré Consulta',
    content: 'Antes das consultas.',
  },
  {
    title: 'Consulta',
    content: 'Durante a consulta.',
  },
  {
    title: 'Pós Consulta',
    content: 'Ao término da consulta.',
  },
];

const ACTIONS: TActionCardProps[] = [
  {
    title: 'Mensagem via Whatsapp',
    subtitle:
      'Enviar mensagem no Whatsapp do paciente (precisa ter um número valido no cadastro)',
    content: (checked) => (
      <div
        className={`overflow-hidden transition-all duration-1000 ease-in-out ${checked ? 'max-h-24' : 'max-h-0'}`}
      >
        <Divider className="m-0!" />

        <div className="p-4 pt-3.5">
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1">
              <Typography.Title level={5}>Mensagem</Typography.Title>
              <Input placeholder="Olá, obrigado por entrar em contato comigo." />
            </div>

            <Button type="primary">Atualizar</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Mensagem via Email',
    subtitle:
      'Enviar mensagem no Email do paciente (precisa ter um número valido no cadastro)',
    content: (checked) => (
      <div
        className={`overflow-hidden transition-all duration-1000 ease-in-out ${checked ? 'max-h-24' : 'max-h-0'}`}
      >
        <Divider className="m-0!" />

        <div className="p-4 pt-3.5">
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1">
              <Typography.Title level={5}>Mensagem</Typography.Title>
              <Input placeholder="Olá, obrigado por entrar em contato comigo." />
            </div>

            <Button type="primary">Atualizar</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Enviar Formulário',
    subtitle: 'Enviar Anamneses / Formulários cadastrados',
  },
];

const Workflows = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    setCurrent(value);
  };

  return (
    <FadeWrapper>
      <Card variant="borderless" classNames={{ body: 'pt-3.5!' }}>
        <Title level={2} className="mb-1!">
          Jornada do Paciente
        </Title>

        <Paragraph>
          Gerencie a jornada completa dos pacientes, desde o pré até o
          pós-consulta. Defina etapas, organize o fluxo de atendimento e
          configure automações para enviar mensagens e executar ações em cada
          fase do processo.
        </Paragraph>

        <Title level={3} className="m-0! mb-1!">
          Eventos
        </Title>

        <Steps
          type="panel"
          current={current}
          onChange={onChange}
          className="*:rounded-b-none!"
          items={STEP_ITEMS}
        />

        <Card
          className="overflow-hidden rounded-t-none!"
          classNames={{ body: 'p-0!' }}
        >
          <div className="relative p-4 shadow-sm">
            <Title level={5} className="mb-0!">
              Ações
            </Title>
            <Paragraph className="mb-0!">
              Essas <b>ações</b> serão disparadas quando o evento{' '}
              <b>{STEP_ITEMS[current].title}</b> acontecer.
            </Paragraph>
          </div>

          <div
            style={{ background: colorBgLayout }}
            className="flex w-full flex-col gap-2 p-4"
          >
            {ACTIONS.map((p) => (
              <ActionCard key={`action-card-${p.title}`} {...p} />
            ))}
          </div>
        </Card>
      </Card>
    </FadeWrapper>
  );
};

export default Workflows;
