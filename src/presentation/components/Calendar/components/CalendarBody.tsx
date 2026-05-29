import { useCallback, useEffect, useRef } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { CALENDAR_PROPERTIES } from '@constants/CALENDAR_PROPERTIES';

import type { TAppointment, TGetAppointmentResponse } from '@store/Appointment';

import { leftSideWidth } from '../Calendar';

import CalendarEventCard from './CalendarEventCard';
import CalendarGrid from './CalendarGrid';
import TimeLine from './TimeLine';

export const cardPadding = 4;

type THourCalendarProps = {
  appointments?: TGetAppointmentResponse[];
  onSelectAppointment?: (appointment: TAppointment) => void;
  onCellClick?: (date: Dayjs) => void;
};

const CalendarBody: React.FC<THourCalendarProps> = (props) => {
  const { appointments, onSelectAppointment, onCellClick } = props;

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollTo({
        top: calendarRef.current.scrollHeight / 4,
      });
    }
  }, []);

  const handleCellClick = useCallback(
    (day: Dayjs, hour: number) => {
      const date = dayjs(day).hour(hour).minute(0).second(0).millisecond(0);

      onCellClick?.(date);
    },
    [onCellClick],
  );

  return (
    <div ref={calendarRef} className="flex flex-1 overflow-auto">
      <div style={{ width: leftSideWidth }}>
        {Array.from(
          { length: CALENDAR_PROPERTIES.HOURS },
          (_, index) => index,
        ).map((index) => (
          <div
            key={`hour-mark-${index}`}
            className="pr-2 text-right text-xs font-semibold"
            style={{
              height: CALENDAR_PROPERTIES.HOUR_HEIGHT,
            }}
          >
            {index > 0 && index + ' H'}
          </div>
        ))}
      </div>

      <div
        className="relative flex flex-1"
        style={{
          height: CALENDAR_PROPERTIES.FULL_HEIGHT,
        }}
      >
        <TimeLine />

        {appointments &&
          appointments.map((appointment, i) => (
            <div
              key={`calendar-day-${i}`}
              className="relative flex h-full flex-1 flex-col overflow-hidden border-r border-gray-100"
            >
              {appointment?.data.map((appointment) => (
                <CalendarEventCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={() =>
                    onSelectAppointment && onSelectAppointment(appointment)
                  }
                />
              ))}

              <CalendarGrid
                day={appointment.day}
                onCellClick={handleCellClick}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CalendarBody;
