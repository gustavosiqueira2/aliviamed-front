import { Button, Card, Divider, Empty, Typography } from 'antd';
import { Plus } from 'lucide-react';

import type { TInputGroup } from '../NewForm';
import SortableInput from './SortableInput';

const { Title, Text, Paragraph } = Typography;

type TEditGroupCardProps = {
  group?: TInputGroup;
};

const EditGroupCard: React.FC<TEditGroupCardProps> = (props) => {
  const { group } = props;

  if (!group) {
    return (
      <Card
        className="h-full! min-w-[320px]"
        classNames={{ body: 'p-0! py-12!' }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Selecione um grupo para editar"
        />
      </Card>
    );
  }

  return (
    <Card className="h-full! min-w-[320px]" classNames={{ body: 'p-0!' }}>
      <Title level={5} className="m-4!">
        Configurar grupo
      </Title>

      <Divider className="my-2!" />

      <div className="p-4 py-2">
        <Title level={5} className="mb-0!">
          {group.title}
        </Title>

        <Paragraph className="mt-2 mb-0! font-semibold!">
          Campos do grupo
        </Paragraph>
        <Text>Arraste para reordenar o grupo.</Text>
      </div>

      <Divider className="my-0!" />

      <div className="flex flex-col gap-2 p-4">
        {group.inputs.map((input, index) => (
          <SortableInput
            key={input.name}
            id={`${group.id}::${input.name}`}
            index={index}
            groupId={group.id}
            label={input.label}
          />
        ))}

        <Button className="mt-2" icon={<Plus size={16} />}>
          Adicionar Campo
        </Button>
      </div>
    </Card>
  );
};

export default EditGroupCard;
