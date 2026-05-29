import { useState } from 'react';

import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Divider,
  theme,
  Typography,
} from 'antd';
import {
  GripVertical,
  Lightbulb,
  MessageSquareText,
  Phone,
  Plus,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import SortableInputGroup from './SortableInputGroup';
import InputGroupCard from './InputGroupCard';

const { Text } = Typography;

export type TInput = {
  type: string;
  name: string;
  label: string;
};
type TInputGroup = {
  id: string;
  show: boolean;
  title: string;
  description: string;
  Icon: LucideIcon;
  iconColor: string;
  inputs: TInput[];
};

const { Title, Paragraph } = Typography;

const defaultInputGroups: TInputGroup[] = [
  {
    id: '0',
    show: false,
    title: 'Dados básicos',
    description: 'Nome, Idade.',
    Icon: UserRound,
    iconColor: 'blue',
    inputs: [
      {
        type: 'text',
        name: 'name',
        label: 'Nome',
      },
      {
        type: 'number',
        name: 'age',
        label: 'Idade',
      },
    ],
  },
  {
    id: '1',
    show: false,
    title: 'Contato e Endereço',
    description: 'Numero de contato (whatsapp), Emails.',
    Icon: Phone,
    iconColor: 'purple',
    inputs: [
      {
        type: 'phone',
        name: 'phone',
        label: 'Telefone (Whatsapp)',
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email',
      },
    ],
  },
  {
    id: '2',
    show: false,
    title: 'Resumo',
    description: 'Resumo',
    Icon: MessageSquareText,
    iconColor: 'orange',
    inputs: [
      {
        type: 'text',
        name: 'resume',
        label: 'Resumo',
      },
    ],
  },
];

const NewForm = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [inputGroups, setInputGroups] = useState<TInputGroup[]>([]);

  const handleAddGroup = (id: string) => {
    const groupToAdd = defaultInputGroups.find((group) => group.id === id);

    if (groupToAdd) {
      setInputGroups((old) => [...old, groupToAdd]);
    }
  };

  const handleRemoveGroup = (id: string) => {
    setInputGroups((old) => old.filter((group) => group.id !== id));
  };

  return (
    <>
      <Breadcrumb items={[{ title: 'Formulários' }, { title: 'Novo' }]} />

      <div className="flex flex-col gap-4">
        <Card
          className="mt-2! overflow-hidden"
          classNames={{ body: 'p-0! flex flex-col' }}
        >
          <div className="flex justify-between p-4">
            <div>
              <Title level={4}>Criar novo Formulário</Title>
              <Paragraph className="mb-0!">
                Crie e gerencie formulários para coletar informações dos seus
                pacientes. Personalize campos, organize respostas e integre os
                dados ao seu fluxo de atendimento.
              </Paragraph>
            </div>

            <Button type="primary">Salvar formulário</Button>
          </div>

          <Divider className="my-0!" />

          <div className="flex flex-col p-4">
            <Title level={5}>1. Adicionar grupo de perguntas</Title>
            <div className="flex gap-4">
              {defaultInputGroups.map((group) => (
                <InputGroupCard
                  Icon={
                    <group.Icon className={`text-${group.iconColor}-500!`} />
                  }
                  iconBgColorClass={`bg-${group.iconColor}-200/50!`}
                  title={group.title}
                  description={group.description}
                  added={inputGroups.includes(group)}
                  onChangeGroup={(checked) =>
                    checked
                      ? handleAddGroup(group.id)
                      : handleRemoveGroup(group.id)
                  }
                />
              ))}
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Card className="flex-1" classNames={{ body: 'p-0!' }}>
            <div className="flex flex-col p-4 pb-0">
              <Title level={5}>2. Formulário</Title>
              <div className="flex flex-col gap-4">
                {inputGroups.map(({ id, title, inputs }, groupIndex) => (
                  <SortableInputGroup
                    key={`input-group-${groupIndex}`}
                    id={id}
                    title={title}
                    groupIndex={groupIndex}
                    inputs={inputs}
                    onRemove={() => handleRemoveGroup(id)}
                  />
                ))}
              </div>
            </div>

            <Divider className="my-4!" />

            <Alert
              showIcon
              icon={<Lightbulb size={18} color={colorPrimary} />}
              title={
                <Text style={{ color: colorPrimary }}>
                  <b className="font-semibold text-gray-900">Dica:</b> Você pode
                  <b> arrastar</b> os grupos no preview para <b>reordenar</b>!
                </Text>
              }
              style={{
                borderColor: colorPrimary + '40',
                background: colorPrimary + '10',
              }}
              className="m-4!"
            />
          </Card>

          <Card className="h-full! min-w-[320px]" classNames={{ body: 'p-0!' }}>
            <Title level={5} className="m-4!">
              Configuração
            </Title>

            <Divider className="my-2!" />

            <div className="p-4 py-2">
              <div className="flex items-center gap-2">
                <Avatar
                  shape="circle"
                  size={32}
                  icon={<UserRound size={16} className="text-blue-500!" />}
                  className="bg-blue-200/50!"
                />

                <Title level={5} className="mb-0!">
                  Dados básicos
                </Title>
              </div>

              <Paragraph className="mt-2 mb-0! font-semibold!">
                Campos do grupo
              </Paragraph>
              <Text className="text-gray-500!">
                Arraste para reordenar o grupo.
              </Text>
            </div>

            <Divider className="my-0!" />

            <div className="flex flex-col gap-2 p-4">
              <Card
                size="small"
                className="flex-1 cursor-grab"
                classNames={{ body: 'flex items-center gap-2 p-2!' }}
              >
                <GripVertical size={16} color="#d1d5db" />

                <div className="flex flex-col">
                  <Title level={5} className="mb-0! text-sm!">
                    Nome
                  </Title>
                  <Checkbox>Obrigatório</Checkbox>
                </div>
              </Card>
              <Card
                size="small"
                className="flex-1 cursor-grab"
                classNames={{ body: 'flex items-center gap-2 p-2!' }}
              >
                <GripVertical size={16} color="#d1d5db" />

                <div className="flex flex-col">
                  <Title level={5} className="mb-0! text-sm!">
                    Idade
                  </Title>
                  <Checkbox>Obrigatório</Checkbox>
                </div>
              </Card>

              <Button className="mt-2" icon={<Plus size={16} />}>
                Adicionar Campo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NewForm;
