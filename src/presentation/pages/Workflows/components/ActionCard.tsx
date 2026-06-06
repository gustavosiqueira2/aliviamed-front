import { useState } from 'react';

import { Card, Switch, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export type TActionCardProps = {
  title: string;
  subtitle: string;
  content?: (checked: boolean) => React.ReactNode;
};

const ActionCard: React.FC<TActionCardProps> = (props) => {
  const { title, subtitle, content } = props;

  const [checked, setChecked] = useState(true);

  return (
    <Card classNames={{ body: 'p-0!' }}>
      <div className={`flex justify-between p-4`}>
        <div>
          <Title level={5} className="mb-0.5!">
            {title}
          </Title>
          <Paragraph className="mb-0!">{subtitle}</Paragraph>
        </div>

        <Switch
          checkedChildren="Ativado"
          unCheckedChildren="Desativado"
          defaultChecked={checked}
          onChange={() => setChecked((c) => !c)}
        />
      </div>

      {content && content(checked)}
    </Card>
  );
};

export default ActionCard;
