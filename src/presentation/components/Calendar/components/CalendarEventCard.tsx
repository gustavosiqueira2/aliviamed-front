import dayjs from 'dayjs';

import { EVENT_COLOR } from '@constants/EVENT_COLOR';

import { getCalendarCardTop } from '@functions/getCalendarCardTop';

import type { TAppointment } from '@store/Appointment';

import { cardPadding } from './CalendarBody';

type TEventCardProps = {
  appointment: TAppointment;
  onClick?: () => void;
};

const CalendarEventCard: React.FC<TEventCardProps> = (props) => {
  const { appointment, onClick } = props;

  const start = dayjs(appointment.startsAt);
  const end = dayjs(appointment.endsAt);

  const top = getCalendarCardTop(start);
  const height = getCalendarCardTop(end);

  return (
    <div
      onClick={onClick}
      className="z-50 flex cursor-pointer flex-col overflow-hidden rounded-sm p-1 text-xs text-white shadow-sm"
      style={{
        position: 'absolute',
        top: cardPadding / 2 + top,
        height: height - top - cardPadding,
        width: `calc(${100 + '%'} - ${cardPadding}px)`,
        left: cardPadding / 2,
        backgroundColor: EVENT_COLOR[appointment.status],
      }}
    >
      <span style={{ fontSize: 10 }}>
        {start.format('HH:mm')} - {end.format('HH:mm')}
      </span>
      <span>{appointment.patient.name}</span>
    </div>
  );
};

export default CalendarEventCard;
