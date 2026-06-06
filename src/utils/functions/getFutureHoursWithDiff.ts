import dayjs from 'dayjs';

import { DAY_HOURS } from '@constants/DAY_HOURS';

export function getFutureHoursWithDiff(startHour?: string) {
  const format = 'HH:mm';
  const baseTime = dayjs(startHour, format);

  const result = DAY_HOURS.map(({ value }) => {
    const current = dayjs(value, format);
    const diff = current.diff(baseTime, 'minute');

    if (diff <= 0) return null;

    const label = !startHour
      ? ''
      : diff < 60
        ? `(${diff}m)`
        : `(${(diff / 60).toFixed(2)}h)`;

    return {
      value,
      label: `${value} ${label}`,
    };
  }).filter((v) => v !== null);

  return result;
}
