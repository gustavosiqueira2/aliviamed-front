import { useSortable } from '@dnd-kit/react/sortable';
import { Card, Checkbox, Typography } from 'antd';
import { GripVertical } from 'lucide-react';

const { Title } = Typography;

type TSortableInputProps = {
  id: string;
  index: number;
  groupId: string;
  label: string;
};

const SortableInput: React.FC<TSortableInputProps> = (props) => {
  const { id, index, groupId, label } = props;

  const { ref } = useSortable({
    id: id,
    index,
    group: `inputs:${groupId}`,
    type: 'form-input',
    accept: 'form-input',
  });

  return (
    <div ref={ref}>
      <Card
        size="small"
        className="flex-1 cursor-grab"
        classNames={{ body: 'flex items-center gap-2 p-2!' }}
      >
        <GripVertical size={16} color="#d1d5db" />

        <div className="flex flex-col">
          <Title level={5} className="mb-0! text-sm!">
            {label}
          </Title>
          <Checkbox>Obrigatório</Checkbox>
        </div>
      </Card>
    </div>
  );
};

export default SortableInput;
