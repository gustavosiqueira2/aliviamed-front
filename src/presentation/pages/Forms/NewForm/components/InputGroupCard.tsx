import { Avatar, Card, Switch, Typography } from 'antd';

const { Title, Paragraph } = Typography;

type TInputGroupCardProps = {
  title: string;
  description: string;
  Icon: React.ReactNode;
  iconBgColorClass: string;
  added: boolean;
  onChangeGroup: (checked: boolean) => void;
};

const InputGroupCard: React.FC<TInputGroupCardProps> = (props) => {
  const { title, description, Icon, iconBgColorClass, added, onChangeGroup } =
    props;

  return (
    <Card
      size="small"
      className="flex-1"
      classNames={{ body: 'h-full flex gap-4 items-center' }}
    >
      <Avatar
        shape="circle"
        size={48}
        icon={Icon}
        className={iconBgColorClass}
      />

      <div className="flex-1">
        <Title level={5} className="mb-0.5!">
          {title}
        </Title>
        <Paragraph className="mb-0!">{description}</Paragraph>
      </div>

      <div className="flex h-full items-start justify-end">
        <Switch
          checked={added}
          onChange={(checked) => onChangeGroup(checked)}
        />
      </div>
    </Card>
  );
};

export default InputGroupCard;
