import { Dayjs } from 'dayjs';

import { MoveRight } from 'lucide-react';
import { Typography } from 'antd';

import { formatTimerRange } from '@functions/formatTimerRange';

import { useNow } from '@hooks/useNow';

const { Title } = Typography;

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
        <Title level={5} className="my-0! text-gray-700!">
          {startFormatted}
        </Title>

        <MoveRight size={16} className="text-gray-700!" />

        <Title level={5} className="my-0! text-gray-700!">
          {endFormatted}
        </Title>
      </div>

      <span className="text-sm text-gray-500">{duration}</span>
    </div>
  );
};

export default Timer;
