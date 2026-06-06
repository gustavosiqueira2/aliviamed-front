import { Dayjs } from 'dayjs';

import { MoveRight } from 'lucide-react';
import { Typography } from 'antd';

import { formatTimerRange } from '@functions/formatTimerRange';

import { useNow } from '@hooks/useNow';

const { Title, Text } = Typography;

type TTimerProps = {
  start: Dayjs;
};

const Timer: React.FC<TTimerProps> = ({ start }) => {
  const now = useNow();
  const { startFormatted, endFormatted, duration } = formatTimerRange({
    start,
    end: now,
  });

  return (
    <div className="flex flex-col items-end justify-end">
      <div className="flex items-center gap-1">
        <Title level={5} className="my-0!">
          {startFormatted}
        </Title>

        <MoveRight size={16} />

        <Title level={5} className="my-0!">
          {endFormatted}
        </Title>
      </div>

      <Text className="text-sm!">{duration}</Text>
    </div>
  );
};

export default Timer;
