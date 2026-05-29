import { Dayjs } from 'dayjs';

type Params = {
  start: Dayjs;
  end: Dayjs;
};

export const formatTimerRange = ({ start, end }: Params) => {
  const diffInSeconds = end.diff(start, 'second');

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  parts.push(`${seconds}s`);

  const duration = parts.join('');

  return {
    startFormatted: start.format('HH:mm'),
    endFormatted: end.format('HH:mm'),
    duration,
  };
};
