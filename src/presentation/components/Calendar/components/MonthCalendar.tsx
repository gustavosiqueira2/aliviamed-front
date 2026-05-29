import { useMemo, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, theme, Tooltip } from 'antd';

import { generateCalendarMonth } from '@functions/generateCalendarMonth';

type TMonthCalendarProps = {
  selectedDate: Dayjs;
  onSelectDate?: (date: Dayjs) => void;
};

const MonthCalendar: React.FC<TMonthCalendarProps> = (props) => {
  const { selectedDate, onSelectDate } = props;

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [currentDate, setCurrentDate] = useState(dayjs());

  const calendarMonth = useMemo(
    () => generateCalendarMonth(currentDate.month(), currentDate.year()),
    [currentDate],
  );

  const today = useMemo(() => dayjs(), []);

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, 'month'));
  };

  return (
    <div className="border-b border-gray-100/80 px-2 py-4">
      <div className="flex items-center justify-between pb-2">
        <div className="pl-4">
          {currentDate
            .format('MMMM [de] YYYY')
            .replace(/^./, (c) => c.toUpperCase())}
        </div>

        <div>
          <Tooltip title="Mês anterior" placement="bottom">
            <Button
              type="text"
              shape="circle"
              onClick={() => handlePreviousMonth()}
            >
              <ChevronLeft size={16} className="text-gray-400" />
            </Button>
          </Tooltip>

          <Tooltip title="Próximo mês" placement="bottom">
            <Button
              type="text"
              shape="circle"
              onClick={() => handleNextMonth()}
            >
              <ChevronRight size={16} className="text-gray-400" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2 px-2">
        {calendarMonth.map((week, i) => (
          <div key={`week-${i}`} className="flex justify-center gap-2">
            {week.map((day) => {
              const isSelectedDate = selectedDate?.isSame(day.date, 'date');

              return (
                <div
                  key={`week-${i}-day-${day.day}`}
                  style={{
                    borderColor: today.isSame(day.date, 'date')
                      ? colorPrimary
                      : undefined,
                    background: isSelectedDate ? colorPrimary : undefined,
                  }}
                  className={
                    (day.currentMonth ? '' : 'text-gray-400! ') +
                    (isSelectedDate
                      ? 'text-white! '
                      : 'text-gray-700 hover:bg-gray-100 ') +
                    'flex h-6 min-h-6 max-w-6 min-w-6 flex-1 cursor-pointer items-center justify-center rounded-full border border-dashed border-transparent text-[12px]'
                  }
                  onClick={() => onSelectDate && onSelectDate(day.date)}
                >
                  {day.day}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthCalendar;
