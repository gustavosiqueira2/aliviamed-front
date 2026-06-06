import { useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

export const useNow = (interval = 1000) => {
  const [now, setNow] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return now;
};
