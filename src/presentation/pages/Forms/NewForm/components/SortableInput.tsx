import { useState } from 'react';

import { useSortable } from '@dnd-kit/react/sortable';
import { Button, Card, Checkbox, Input, Modal, Select, Typography } from 'antd';
import { GripVertical, ListChecks, Plus, Trash2 } from 'lucide-react';

import type { TInput } from '../NewForm';

const { Text } = Typography;

const TYPE_OPTIONS = [
  { value: 'text', label: 'Texto' },
  { value: 'textarea', label: 'Texto longo' },
  { value: 'number', label: 'Número' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Seleção' },
];

type TSortableInputProps = {
  id: string;
  index: number;
  groupId: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  onChange: (patch: Partial<TInput>) => void;
};

const SortableInput: React.FC<TSortableInputProps> = (props) => {
  const { id, index, groupId, label, type, required, onChange } = props;

  const options = props.options ?? [];

  const [optionsOpen, setOptionsOpen] = useState(false);

  const { ref, handleRef } = useSortable({
    id: id,
    index,
    group: `inputs:${groupId}`,
    type: 'form-input',
    accept: 'form-input',
  });

  const setOptions = (next: string[]) => onChange({ options: next });

  const updateOption = (optionIndex: number, value: string) =>
    setOptions(options.map((opt, i) => (i === optionIndex ? value : opt)));

  const removeOption = (optionIndex: number) =>
    setOptions(options.filter((_, i) => i !== optionIndex));

  const addOption = () => setOptions([...options, `Opção ${options.length + 1}`]);

  return (
    <div ref={ref}>
      <Card size="small" classNames={{ body: 'flex items-center gap-2 p-2!' }}>
        <span ref={handleRef} className="cursor-grab touch-none">
          <GripVertical size={16} color="#d1d5db" />
        </span>

        <div className="flex flex-1 flex-col gap-2">
          <Input
            size="small"
            value={label}
            placeholder="Rótulo do campo"
            onChange={(event) => onChange({ label: event.target.value })}
          />

          <div className="flex items-center gap-2">
            <Select
              size="small"
              className="flex-1"
              value={type}
              options={TYPE_OPTIONS}
              onChange={(value) => onChange({ type: value })}
            />

            <Checkbox
              checked={!!required}
              onChange={(event) => onChange({ required: event.target.checked })}
            >
              Obrigatório
            </Checkbox>
          </div>

          {type === 'select' && (
            <Button
              size="small"
              icon={<ListChecks size={14} />}
              onClick={() => setOptionsOpen(true)}
            >
              Opções ({options.length})
            </Button>
          )}
        </div>
      </Card>

      <Modal
        title="Opções do campo"
        open={optionsOpen}
        onCancel={() => setOptionsOpen(false)}
        onOk={() => setOptionsOpen(false)}
        okText="Concluir"
        cancelText="Fechar"
      >
        <div className="flex flex-col gap-2 py-2">
          {options.length === 0 && (
            <Text type="secondary">
              Nenhuma opção ainda. Adicione a primeira abaixo.
            </Text>
          )}

          {options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <Input
                value={option}
                placeholder={`Opção ${optionIndex + 1}`}
                onChange={(event) =>
                  updateOption(optionIndex, event.target.value)
                }
              />
              <Button
                type="text"
                danger
                icon={<Trash2 size={16} />}
                aria-label="Remover opção"
                onClick={() => removeOption(optionIndex)}
              />
            </div>
          ))}

          <Button
            type="dashed"
            icon={<Plus size={16} />}
            onClick={addOption}
            className="mt-1"
          >
            Adicionar opção
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SortableInput;
