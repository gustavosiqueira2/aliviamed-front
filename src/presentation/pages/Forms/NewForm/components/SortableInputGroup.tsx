import { useState } from 'react';

import { useSortable } from '@dnd-kit/react/sortable';

import { GripVertical, Minus, Pencil, Settings } from 'lucide-react';
import { Button, Card, Input, Tooltip } from 'antd';

import type { TInput } from '../NewForm';

type TSortableInputGroupProps = {
  groupIndex: number;
  id: string;
  title: string;
  inputs: TInput[];
  onChangeTitle: (title: string) => void;
  onEdit: () => void;
  onRemove: () => void;
};

const SortableInputGroup: React.FC<TSortableInputGroupProps> = (props) => {
  const { id, title, groupIndex, inputs, onChangeTitle, onEdit, onRemove } =
    props;

  const { ref } = useSortable({
    id: id,
    index: groupIndex,
    group: 'form-groups',
    type: 'form-group',
    accept: 'form-group',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleSaveTitle = () => {
    setIsEditing(false);
    onChangeTitle(newTitle);
  };

  return (
    <div ref={ref} className="flex items-center">
      <GripVertical color="#d1d5db" />
      <Card
        title={
          <>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onPressEnter={handleSaveTitle}
                  className="max-w-100"
                />

                <Button type="primary" onClick={handleSaveTitle}>
                  Salvar
                </Button>
              </div>
            ) : (
              title + ' '
            )}

            {!isEditing && (
              <Tooltip title="Editar nome do grupo" placement="top">
                <Button
                  shape="circle"
                  type="text"
                  size="small"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={14} />
                </Button>
              </Tooltip>
            )}
          </>
        }
        extra={
          <div className="flex gap-2">
            <Button
              shape="circle"
              size="medium"
              className="group hover:border-blue-600!"
              onClick={onEdit}
            >
              <Settings
                size={14}
                className="text-gray-600 group-hover:text-blue-600"
              />
            </Button>
            <Button
              shape="circle"
              size="medium"
              className="group hover:border-red-600!"
              onClick={onRemove}
            >
              <Minus
                size={14}
                className="text-gray-600 group-hover:text-red-600"
              />
            </Button>
          </div>
        }
        className="flex-1 cursor-grab select-none"
        classNames={{ body: 'gap-2 flex pointer-events-none' }}
      >
        {inputs.map(({ label }) => (
          <Input placeholder={label} />
        ))}
      </Card>
    </div>
  );
};

export default SortableInputGroup;
