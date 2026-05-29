import React, { memo } from 'react';

import type { Dayjs } from 'dayjs';

import { Plus } from 'lucide-react';

import { CALENDAR_PROPERTIES } from '@constants/CALENDAR_PROPERTIES';

type TCalendarGridProps = {
  day: Dayjs;
  onCellClick: (day: Dayjs, hour: number) => void;
};

const CalendarGridComponent: React.FC<TCalendarGridProps> = ({
  day,
  onCellClick,
}) => {
  return Array.from({ length: CALENDAR_PROPERTIES.HOURS }, (_, hour) => (
    <div
      key={`day-calendar-cell-${hour}`}
      className="group border-b border-gray-200 p-0.5"
      style={{
        height: CALENDAR_PROPERTIES.HOUR_HEIGHT,
      }}
    >
      <div
        onClick={() => onCellClick(day, hour)}
        className="flex h-full w-full cursor-pointer items-center justify-center rounded-sm opacity-0 transition-opacity duration-200 group-hover:bg-gray-50 group-hover:opacity-100"
      >
        <Plus className="text-gray-300!" size={14} />
      </div>
    </div>
  ));
};

const CalendarGrid = memo(CalendarGridComponent);

export default CalendarGrid;
