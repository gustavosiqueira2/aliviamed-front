import type { Dayjs } from 'dayjs';

import { ChevronLeft } from 'lucide-react';
import { Button, theme, Tooltip } from 'antd';

import { leftSideWidth, type TCalendarModes } from '../Calendar';

import styles from '../Calendar.module.css';

type TCalendarHeaderDaysProps = {
  dates: Dayjs[];
  mode: TCalendarModes;
  onChangeMode?: () => void;
  onSelectDate?: (date: Dayjs) => void;
};

const CalendarHeader: React.FC<TCalendarHeaderDaysProps> = (props) => {
  const { dates, mode, onChangeMode, onSelectDate } = props;

  const {
    token: { colorPrimary },
  } = theme.useToken();

  return (
    <div className="flex h-18 w-full border-b border-gray-300">
      <div
        style={{ width: leftSideWidth, height: '100%' }}
        className="flex flex-col items-end justify-end pr-2"
      >
        {onChangeMode && mode === 'day' && (
          <div className="flex flex-1 items-center">
            <Tooltip title="Voltar" placement="bottom">
              <Button shape="round" type="dashed" onClick={onChangeMode}>
                <ChevronLeft size={16} className="text-gray-500" />
              </Button>
            </Tooltip>
          </div>
        )}

        <span className="text-xs font-semibold">GMT-03</span>
      </div>

      <div className={styles.hiddenScrollbar}>
        {dates.map((date, i) => (
          <div
            key={`calendar-header-day-${i}`}
            className="relative flex h-full flex-1 flex-col items-center justify-center"
          >
            <div
              className="absolute bottom-0 -left-px z-10 h-4 bg-gray-200"
              style={{
                width: i === 0 ? 2 : 1,
              }}
            />

            <span
              style={{
                color: i === 0 ? colorPrimary : undefined,
              }}
              className="text-xs font-semibold text-gray-700"
            >
              {date.format('ddd.').toLocaleUpperCase()}
            </span>

            <button
              onClick={() => onSelectDate && onSelectDate(date)}
              style={{
                background: i === 0 ? colorPrimary : undefined,
              }}
              className={`${
                i === 0 ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
              } flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300`}
            >
              <span className="text-xl">{date.get('D')}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
