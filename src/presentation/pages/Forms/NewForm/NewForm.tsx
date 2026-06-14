import { useState } from 'react';

import { useNavigate } from 'react-router';

import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Divider,
  Input,
  Modal,
  theme,
  Typography,
} from 'antd';
import {
  ArrowUpDown,
  Eye,
  ListPlus,
  Settings,
  type LucideIcon,
} from 'lucide-react';

import { DragDropProvider, type DragOverEvent } from '@dnd-kit/react';

import { DEFAULT_FORM_INPUT_GROUP } from '@constants/DEFAULT_FORM_INPUT_GROUP';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { getApiError } from '@functions/getApiError';

import type { TFormSchemaGroup } from '@interfaces/Form.interface';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useAuth } from '@store/Auth.store';
import { useCreateForm } from '@store/Form.store';

import FormPreview from '@components/FormPreview';

import SortableInputGroup from './components/SortableInputGroup';
import InputGroupCard from './components/InputGroupCard';
import EditGroupCard from './components/EditGroupCard';
import CreateGroupCard from './components/CreateGroupCard';

const { Text } = Typography;

export type TInput = {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  options?: string[];
};

export type TInputGroup = {
  id: string;
  show: boolean;
  title: string;
  description: string;
  Icon: LucideIcon;
  iconColor: string;
  inputs: TInput[];
};

const { Title, Paragraph } = Typography;

const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const next = array.slice();
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
};

const getUniqueName = (base: string, existing: string[]): string => {
  if (!existing.includes(base)) return base;

  let index = 1;
  while (existing.includes(`${base} (${index})`)) index++;

  return `${base} (${index})`;
};

const NewForm = () => {
  const {
    token: { colorPrimary, blue6 },
  } = theme.useToken();

  const { data } = useAuth();

  const navigate = useNavigate();
  const { notify } = useNotificationContext();
  const createForm = useCreateForm();

  const [inputGroups, setInputGroups] = useState<TInputGroup[]>([]);

  const [groupToEditId, setGroupToEditId] = useState<string>();

  const [previewOpen, setPreviewOpen] = useState(false);

  const [saveOpen, setSaveOpen] = useState(false);
  const [formName, setFormName] = useState('');

  const groupToEdit = inputGroups.find((group) => group.id === groupToEditId);

  const handleAddGroup = (id: string) => {
    const groupToAdd = DEFAULT_FORM_INPUT_GROUP.find(
      (group) => group.id === id,
    );

    if (groupToAdd) {
      setInputGroups((old) => [...old, groupToAdd]);
    }
  };

  const handleCreateGroup = () => {
    setInputGroups((old) => {
      const title = getUniqueName(
        'Novo grupo',
        old.map((group) => group.title),
      );

      const newGroup: TInputGroup = {
        id: crypto.randomUUID(),
        show: false,
        title,
        description: '',
        Icon: ListPlus,
        iconColor: 'purple',
        inputs: [],
      };

      return [...old, newGroup];
    });
  };

  const handleRemoveGroup = (id: string) => {
    if (id === groupToEditId) {
      setGroupToEditId(undefined);
    }

    setInputGroups((old) => old.filter((group) => group.id !== id));
  };

  const handleAddInput = (groupId: string) => {
    setInputGroups((old) =>
      old.map((group) => {
        if (group.id !== groupId) return group;

        const label = getUniqueName(
          'Novo campo',
          group.inputs.map((input) => input.label),
        );

        const newInput: TInput = {
          type: 'text',
          name: `campo-${crypto.randomUUID().slice(0, 8)}`,
          label,
        };

        return { ...group, inputs: [...group.inputs, newInput] };
      }),
    );
  };

  const handleChangeInput = (
    groupId: string,
    inputName: string,
    patch: Partial<TInput>,
  ) => {
    setInputGroups((old) =>
      old.map((group) => {
        if (group.id !== groupId) return group;

        return {
          ...group,
          inputs: group.inputs.map((input) =>
            input.name === inputName ? { ...input, ...patch } : input,
          ),
        };
      }),
    );
  };

  const handlePreview = () => setPreviewOpen(true);

  const handleChangeGroupTitle = (id: string, title: string) => {
    setInputGroups((old) =>
      old.map((group) => (group.id === id ? { ...group, title } : group)),
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { source, target } = event.operation;

    if (!source || !target || source.id === target.id) {
      return;
    }

    const sourceId = String(source.id);
    const targetId = String(target.id);

    if (sourceId.includes('::') && targetId.includes('::')) {
      const [sourceGroupId] = sourceId.split('::');
      const [targetGroupId] = targetId.split('::');

      if (sourceGroupId !== targetGroupId) return;

      setInputGroups((groups) =>
        groups.map((group) => {
          if (group.id !== sourceGroupId) return group;

          const from = group.inputs.findIndex(
            (input) => `${group.id}::${input.name}` === sourceId,
          );
          const to = group.inputs.findIndex(
            (input) => `${group.id}::${input.name}` === targetId,
          );

          if (from < 0 || to < 0) return group;

          return { ...group, inputs: arrayMove(group.inputs, from, to) };
        }),
      );

      return;
    }

    setInputGroups((groups) => {
      const from = groups.findIndex((group) => group.id === sourceId);
      const to = groups.findIndex((group) => group.id === targetId);

      if (from < 0 || to < 0) return groups;

      return arrayMove(groups, from, to);
    });
  };

  const handleSaveForm = () => {
    if (inputGroups.length === 0) {
      notify({
        type: 'warning',
        title: 'Adicione ao menos um grupo',
        description: 'Inclua pelo menos um grupo de perguntas antes de salvar.',
      });

      return;
    }

    setSaveOpen(true);
  };

  const onConfirmSave = async () => {
    const name = formName.trim();

    if (!name) {
      notify({
        type: 'warning',
        title: 'Informe um nome para o formulário',
        description: 'O nome ajuda a identificar o formulário na listagem.',
      });

      return;
    }

    const schema: TFormSchemaGroup[] = inputGroups.map(
      ({ id, title, description, inputs }) => ({
        id,
        title,
        description,
        inputs,
      }),
    );

    try {
      await createForm.mutateAsync({ name, schema });

      notify({
        type: 'success',
        title: 'Formulário salvo',
        description: `"${name}" foi criado com sucesso.`,
      });

      navigate(ROUTE_NAMES.FORMS);
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível salvar',
        description: getApiError(err),
      });
    }
  };

  return (
    <>
      <Breadcrumb items={[{ title: 'Formulários' }, { title: 'Novo' }]} />

      <DragDropProvider onDragOver={handleDragOver}>
        <div className="flex flex-col gap-4">
          <Card
            variant="borderless"
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

              <div className="flex items-center gap-2">
                <Button icon={<Eye size={14} />} onClick={handlePreview}>
                  Preview
                </Button>
                <Button type="primary" onClick={handleSaveForm}>
                  Salvar formulário
                </Button>
              </div>
            </div>

            <Divider className="my-0!" />

            <div className="flex flex-col p-4">
              <Title level={5}>1. Adicionar grupos de perguntas</Title>

              <div className="flex gap-4">
                {DEFAULT_FORM_INPUT_GROUP.map((group) => (
                  <InputGroupCard
                    Icon={
                      <group.Icon className={`text-${group.iconColor}-500!`} />
                    }
                    iconBgColorClass={`bg-${group.iconColor}-200!`}
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
            <Card
              variant="borderless"
              className="flex h-min! flex-1"
              classNames={{ body: 'p-0! flex-1 flex flex-col' }}
            >
              <div className="flex flex-1 flex-col p-4 pb-0">
                <Title level={5}>2. Ordenar formulário</Title>

                <div className="flex flex-col gap-4">
                  {inputGroups.map((group, groupIndex) => (
                    <SortableInputGroup
                      key={group.id}
                      groupIndex={groupIndex}
                      id={group.id}
                      title={group.title}
                      inputs={group.inputs}
                      onChangeTitle={(title) =>
                        handleChangeGroupTitle(group.id, title)
                      }
                      onEdit={() => setGroupToEditId(group.id)}
                      onRemove={() => handleRemoveGroup(group.id)}
                    />
                  ))}

                  <CreateGroupCard onClick={handleCreateGroup} />
                </div>
              </div>

              <Divider className="my-4!" />

              <div className="m-4 mt-0 flex gap-2">
                <Alert
                  className="flex-1"
                  showIcon
                  icon={<ArrowUpDown size={18} color={colorPrimary} />}
                  title={
                    <Text style={{ color: colorPrimary }}>
                      <b className="font-semibold">Dica:</b> Você pode
                      <b> arrastar</b> os grupos para <b>reordenar</b>!
                    </Text>
                  }
                  style={{
                    borderColor: colorPrimary + '40',
                    background: colorPrimary + '10',
                  }}
                />
                <Alert
                  className="flex-1"
                  showIcon
                  icon={<Settings size={18} color={blue6} />}
                  title={
                    <Text style={{ color: blue6 }}>
                      <b className="font-semibold">Dica:</b> Você pode
                      <b> clicar na engrenagem</b> para <b>editar</b> o grupo!
                    </Text>
                  }
                  style={{
                    borderColor: blue6 + '40',
                    background: blue6 + '10',
                  }}
                />
              </div>
            </Card>

            <EditGroupCard
              group={groupToEdit}
              onAddInput={handleAddInput}
              onChangeInput={handleChangeInput}
            />
          </div>
        </div>
      </DragDropProvider>

      <FormPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        clinicName={data?.clinicProfile?.clinic.name}
        groups={inputGroups}
      />

      <Modal
        open={saveOpen}
        title="Salvar formulário"
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={createForm.isPending}
        onOk={() => void onConfirmSave()}
        onCancel={() => setSaveOpen(false)}
      >
        <Text type="secondary">
          Dê um nome para identificar este formulário na listagem.
        </Text>
        <Input
          className="mt-2!"
          placeholder="Ex.: Anamnese inicial"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          onPressEnter={() => void onConfirmSave()}
          maxLength={100}
        />
      </Modal>
    </>
  );
};

export default NewForm;
