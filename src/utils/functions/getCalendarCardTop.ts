import type { Dayjs } from 'dayjs';

import { CALENDAR_PROPERTIES } from '@constants/CALENDAR_PROPERTIES';

export const getCalendarCardTop = (date: Dayjs) => {
  const h = date.get('h');
  const m = date.get('minute');

  const hourHeight =
    h * CALENDAR_PROPERTIES.STEP_HEIGHT * CALENDAR_PROPERTIES.STEP_COUNT;
  const minutesHeight = Math.max(0, m / 15) * CALENDAR_PROPERTIES.STEP_HEIGHT;

  return hourHeight + minutesHeight;
};
