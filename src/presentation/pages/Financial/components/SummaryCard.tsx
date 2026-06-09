import { Card, Typography } from 'antd';

import type { LucideIcon } from 'lucide-react';

const { Text } = Typography;

type TSummaryCardProps = {
  icon: LucideIcon;
  color: string;
  label: string;
  value: string;
  valueClassName?: string;
};

const SummaryCard: React.FC<TSummaryCardProps> = (props) => {
  const { icon: Icon, color, label, value, valueClassName } = props;

  return (
    <Card classNames={{ body: 'p-4!' }}>
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          <Icon size={22} />
        </div>

        <div className="flex min-w-0 flex-col">
          <Text type="secondary" className="truncate text-xs text-gray-500">
            {label}
          </Text>
          <Text
            className={`truncate text-xl! font-semibold ${valueClassName ?? 'text-gray-900'}`}
          >
            {value}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;
