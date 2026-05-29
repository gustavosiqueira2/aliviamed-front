import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { getCalendarCardTop } from '@functions/getCalendarCardTop';

import { cardPadding } from './CalendarBody';

const TimeLine = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(dayjs());
    };

    updateTime();

    const interval = setInterval(updateTime, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute bg-red-500"
      style={{
        top: getCalendarCardTop(currentTime),
        left: -cardPadding / 2,
        height: 1,
        width: '100%',
        zIndex: 60,
      }}
    >
      <div className="absolute -translate-x-full -translate-y-1/2 rounded-sm bg-red-500 px-1">
        <span className="text-xs text-white">
          {currentTime.format('HH:mm')}
        </span>
      </div>
    </div>
  );
};

export default TimeLine;
