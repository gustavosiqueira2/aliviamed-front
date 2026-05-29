import dayjs from 'dayjs';

type TCalendarDay = {
  date: dayjs.Dayjs;
  day: number;
  currentMonth: boolean;
};

type TCalendarWeek = TCalendarDay[];

export const generateCalendarMonth = (
  month: number, // 0-11
  year: number,
): TCalendarWeek[] => {
  const startOfMonth = dayjs().year(year).month(month).startOf('month');

  const startWeekDay = startOfMonth.day();

  const calendarStart = startOfMonth.subtract(startWeekDay, 'day');

  const weeks: TCalendarWeek[] = [];

  let currentDate = calendarStart;

  for (let week = 0; week < 6; week++) {
    const days: TCalendarDay[] = [];

    for (let day = 0; day < 7; day++) {
      days.push({
        date: currentDate,
        day: currentDate.date(),
        currentMonth: currentDate.month() === month,
      });

      currentDate = currentDate.add(1, 'day');
    }

    weeks.push(days);
  }

  return weeks;
};
