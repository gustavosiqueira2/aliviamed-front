import { useCallback, useState } from 'react';

import type { Dayjs } from 'dayjs';

import {
  APPOINTMENT_STATUS,
  type TAppointmentStatus,
} from '@constants/APPOINTMENT_STATUS';

import CreateAppointmentModal from '@components/Modal/CreateAppointmentModal';
import FadeWrapper from '@components/FadeWrapper';

import AppointmentPageFooter from './components/AppointmentPageFooter';
import AppointmentCalendar from './components/AppointmentCalendar';

const Appointments = () => {
  const [createAppointmentDate, setCreateAppointmentDate] = useState<Dayjs>();
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] =
    useState(false);

  const [statusFilters, setStatusFilters] = useState<
    Record<TAppointmentStatus, boolean>
  >({
    [APPOINTMENT_STATUS.SCHEDULED]: true,
    [APPOINTMENT_STATUS.CONFIRMED]: true,
    [APPOINTMENT_STATUS.WAITING_CONSULTATION]: true,
    [APPOINTMENT_STATUS.IN_CONSULTATION]: true,
    [APPOINTMENT_STATUS.COMPLETED]: true,
    [APPOINTMENT_STATUS.CANCELED]: true,
    [APPOINTMENT_STATUS.NO_SHOW]: true,
  });

  const handleOpenModal = useCallback((date?: Dayjs) => {
    setCreateAppointmentDate(date ? date : undefined);

    setShowCreateAppointmentModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCreateAppointmentModal(false);
  }, []);

  const handleChangeFilter = (filter: keyof typeof APPOINTMENT_STATUS) => {
    setStatusFilters((oldFilters) => ({
      ...oldFilters,
      [filter]: !oldFilters[filter],
    }));
  };

  return (
    <FadeWrapper>
      <CreateAppointmentModal
        open={showCreateAppointmentModal}
        onCancel={handleCloseModal}
        initialStartDate={createAppointmentDate}
      />

      <div className="flex h-full flex-col">
        <AppointmentCalendar onCreateAppointment={handleOpenModal} />

        <AppointmentPageFooter
          filters={statusFilters}
          onChangeFilter={handleChangeFilter}
        />
      </div>
    </FadeWrapper>
  );
};

export default Appointments;
