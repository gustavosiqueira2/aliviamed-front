import { Card, Typography, theme } from 'antd';
import { Plus } from 'lucide-react';

const { Text } = Typography;

type TCreateGroupCardProps = {
  onClick: () => void;
};

const CreateGroupCard: React.FC<TCreateGroupCardProps> = ({ onClick }) => {
  const { token } = theme.useToken();

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer opacity-60 transition hover:opacity-100"
      classNames={{
        body: 'flex flex-col items-center justify-center gap-2 py-6',
      }}
      style={{
        background: 'transparent',
        border: `2px dashed ${token.colorBorder}`,
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{ background: token.colorFillTertiary }}
      >
        <Plus size={20} style={{ color: token.colorTextSecondary }} />
      </div>

      <Text type="secondary">Criar novo grupo</Text>
    </Card>
  );
};

export default CreateGroupCard;
