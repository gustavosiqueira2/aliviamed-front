import { useCallback, useEffect, useMemo, useState, memo } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { Button, Segmented, Typography } from 'antd';

import { useSearchParams } from 'react-router';

import { useAppointment, useAppointments } from '@store/Appointment.store';
import type {
  TAppointment,
  TAppointmentResponse,
} from '@interfaces/Appointment.interface';

import { PERMISSIONS } from '@constants/PERMISSIONS';

import { usePermissions } from '@hooks/usePermissions';

import Calendar, { type TCalendarModes } from '@components/Calendar/Calendar';
import Can from '@components/Can/Can';

import AppointmentDetails from './AppointmentDetails/AppointmentDetails';

const { Title } = Typography;

const WEEK_DAYS = 7;

type TAppointmentCalendarProps = {
  onCreateAppointment: (date?: Dayjs) => void;
};

const AppointmentCalendar: React.FC<TAppointmentCalendarProps> = ({
  onCreateAppointment,
}) => {
  const { hasPermission } = usePermissions();
  const canCreateAppointment = hasPermission(PERMISSIONS.APPOINTMENT_CREATE);

  const [searchParams, setSearchParams] = useSearchParams();

  const [mode, setMode] = useState<TCalendarModes>(
    (searchParams.get('mode') as TCalendarModes) || 'week',
  );

  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => {
    const date = searchParams.get('date');

    return date ? dayjs(date) : dayjs();
  });

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

  const openAppointmentId = searchParams.get('appointment') ?? undefined;

  const selectAppointment = useCallback(
    (appointment?: TAppointment) => {
      setSelectedAppointment(appointment);

      setSearchParams(
        (params) => {
          if (appointment) {
            params.set('appointment', appointment.id);
          } else {
            params.delete('appointment');
          }

          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    const date = selectedDate.format('YYYY-MM-DD');

    if (
      searchParams.get('date') === date &&
      searchParams.get('mode') === mode
    ) {
      return;
    }

    setSearchParams(
      (params) => {
        params.set('date', date);
        params.set('mode', mode);

        return params;
      },
      { replace: true },
    );
  }, [selectedDate, mode, searchParams, setSearchParams]);

  const { data: openAppointment } = useAppointment(openAppointmentId);

  useEffect(() => {
    if (openAppointment && !selectedAppointment) {
      setSelectedAppointment(openAppointment);
    }
  }, [openAppointment, selectedAppointment]);

  const appointments = useMemo(
    () =>
      queries.map(
        (q) => (q.data || { ...q, data: [] }) as TAppointmentResponse,
      ),
    [queries],
  );

  const handleHeaderDateClick = useCallback((date: Dayjs) => {
    setMode('day');
    setSelectedDate(date);
  }, []);

  const handleCellClick = useCallback(
    (date: Dayjs) => {
      if (!canCreateAppointment) return;

      onCreateAppointment(date);
    },
    [onCreateAppointment, canCreateAppointment],
  );

  const handleBackToWeekMode = useCallback(() => {
    setMode('week');
  }, []);

  const detailsComponent = useMemo(
    () => (
      <AppointmentDetails
        appointment={selectedAppointment}
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

          <Can permission={PERMISSIONS.APPOINTMENT_CREATE}>
            <Button type="primary" onClick={() => onCreateAppointment()}>
              Novo agendamento
            </Button>
          </Can>
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
        onSelectAppointment={(appointment) => {
          selectAppointment(appointment);
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
