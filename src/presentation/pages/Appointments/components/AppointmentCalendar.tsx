import { useCallback, useMemo, useState, memo } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { Button, Segmented, Typography } from 'antd';

import {
  useAppointments,
  type TAppointment,
  type TGetAppointmentResponse,
} from '@store/Appointment';

import Calendar, { type TCalendarModes } from '@components/Calendar/Calendar';

import AppointmentDetails from './AppointmentDetails/AppointmentDetails';

const { Title } = Typography;

const WEEK_DAYS = 7;

type TAppointmentCalendarProps = {
  onCreateAppointment: (date?: Dayjs) => void;
};

const AppointmentCalendar: React.FC<TAppointmentCalendarProps> = ({
  onCreateAppointment,
}) => {
  const [mode, setMode] = useState<TCalendarModes>('week');

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const dates = useMemo(() => {
    if (mode === 'day') {
      return [selectedDate];
    }

    return Array.from({ length: WEEK_DAYS }, (_, i) =>
      selectedDate.add(i, 'day'),
    );
  }, [mode, selectedDate]);

  const queries = useAppointments(dates);

  const [selectedAppointment, setSelectedAppointment] =
    useState<TAppointment>();

  const appointments = useMemo(
    () =>
      queries.map(
        (q) => (q.data || { ...q, data: [] }) as TGetAppointmentResponse,
      ),
    [queries],
  );

  const handleHeaderDateClick = useCallback((date: Dayjs) => {
    setMode('day');
    setSelectedDate(date);
  }, []);

  const handleCellClick = useCallback(
    (date: Dayjs) => {
      onCreateAppointment(date);
    },
    [onCreateAppointment],
  );

  const handleBackToWeekMode = useCallback(() => {
    setMode('week');
  }, []);

  const detailsComponent = useMemo(
    () => (
      <AppointmentDetails
        appointment={selectedAppointment}
        onCloseDetails={() => setSelectedAppointment(undefined)}
        onChangeAppointmentStatus={(status) =>
          setSelectedAppointment(
            (appointment) =>
              appointment && {
                ...appointment,
                status,
              },
          )
        }
      />
    ),
    [selectedAppointment],
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Title level={2} className="mb-0!">
            Agendamentos
          </Title>

          <div className="h-8 w-px bg-gray-200" />

          <Button type="primary" onClick={() => onCreateAppointment()}>
            Novo agendamento
          </Button>
        </div>

        <Segmented
          size="large"
          value={mode}
          onChange={(value) => setMode(value as TCalendarModes)}
          options={[
            { label: 'Dia', value: 'day' },
            { label: 'Semana', value: 'week' },
          ]}
        />
      </div>

      <Calendar
        mode={mode}
        dates={dates}
        appointments={appointments}
        selectedDate={selectedDate}
        onHeaderDateClick={handleHeaderDateClick}
        onCellClick={handleCellClick}
        onBackToWeekMode={handleBackToWeekMode}
        onSelectAppointment={(appointments) => {
          setSelectedAppointment(appointments);
        }}
        onMonthDayClick={(date) => {
          setSelectedDate(date);
        }}
        components={{
          DetailsComponent: detailsComponent,
        }}
      />
    </>
  );
};

export default memo(AppointmentCalendar);
