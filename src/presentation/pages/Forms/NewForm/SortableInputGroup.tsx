import { useSortable } from '@dnd-kit/react/sortable';

import { GripVertical, Minus, Settings } from 'lucide-react';
import { Button, Card, Input } from 'antd';

import type { TInput } from './NewForm';

type TSortableInputGroupProps = {
  id: string;
  title: string;
  groupIndex: number;
  inputs: TInput[];
  onRemove: () => void;
};

const SortableInputGroup: React.FC<TSortableInputGroupProps> = (props) => {
  const { id, title, groupIndex, inputs, onRemove } = props;

  const { ref } = useSortable({ id: id, index: groupIndex });

  return (
    <div ref={ref} className="flex items-center">
      <GripVertical color="#d1d5db" />
      <Card
        title={title}
        extra={
          <div className="flex gap-2">
            <Button
              shape="circle"
              size="medium"
              className="group hover:border-blue-600!"
            >
              <Settings
                size={14}
                className="text-gray-600 group-hover:text-blue-600"
              />
            </Button>
            <Button
              onClick={onRemove}
              shape="circle"
              size="medium"
              className="group hover:border-red-600!"
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
