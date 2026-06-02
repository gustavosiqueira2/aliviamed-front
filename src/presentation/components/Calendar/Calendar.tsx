import { memo, type ReactNode } from 'react';

import { type Dayjs } from 'dayjs';

import { Card } from 'antd';

import type { TAppointment, TGetAppointmentResponse } from '@store/Appointment';

import CalendarHeader from './components/CalendarHeader';
import MonthCalendar from './components/MonthCalendar';
import CalendarBody from './components/CalendarBody';

export const leftSideWidth = 64;

export type TCalendarModes = 'week' | 'day';

type TCalendarProps = {
  mode: TCalendarModes;
  dates: Dayjs[];
  appointments: TGetAppointmentResponse[];
  selectedDate: Dayjs;
  onHeaderDateClick?: (date: Dayjs) => void;
  onCellClick?: (date: Dayjs) => void;
  onSelectAppointment?: (appointment: TAppointment) => void;
  onMonthDayClick?: (date: Dayjs) => void;
  onBackToWeekMode?: () => void;
  components: {
    DetailsComponent?: ReactNode;
  };
};

const Calendar: React.FC<TCalendarProps> = (props) => {
  const {
    mode,
    dates,
    appointments,
    selectedDate,
    onHeaderDateClick,
    onCellClick,
    onSelectAppointment,
    onMonthDayClick,
    onBackToWeekMode,
    components: { DetailsComponent },
  } = props;

  return (
    <Card
      variant="borderless"
      className="mt-2! overflow-hidden"
      classNames={{ body: 'p-0! flex h-full overflow-hidden' }}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <CalendarHeader
          dates={dates}
          mode={mode}
          onChangeMode={onBackToWeekMode}
          onSelectDate={onHeaderDateClick}
        />

        <CalendarBody
          appointments={appointments}
          onCellClick={onCellClick}
          onSelectAppointment={onSelectAppointment}
        />
      </div>

      <div className="flex border-b border-gray-100">
        <div className="flex h-full flex-col border-l border-gray-100">
          <MonthCalendar
            selectedDate={selectedDate}
            onSelectDate={onMonthDayClick}
          />

          {DetailsComponent}
        </div>
      </div>
    </Card>
  );
};

export default memo(Calendar);
