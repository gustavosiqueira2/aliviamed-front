import { useCallback, useState } from 'react';

import type { Dayjs } from 'dayjs';

import CreateAppointmentModal from '@components/Modal/CreateAppointmentModal';
import FadeWrapper from '@components/FadeWrapper';

import AppointmentCalendar from './components/AppointmentCalendar';

const Appointments = () => {
  const [createAppointmentDate, setCreateAppointmentDate] = useState<Dayjs>();
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] =
    useState(false);

  const handleOpenModal = useCallback((date?: Dayjs) => {
    setCreateAppointmentDate(date ? date : undefined);

    setShowCreateAppointmentModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCreateAppointmentModal(false);
  }, []);

  return (
    <FadeWrapper>
      <CreateAppointmentModal
        open={showCreateAppointmentModal}
        onCancel={handleCloseModal}
        initialStartDate={createAppointmentDate}
      />

      <div className="flex h-full flex-col">
        <AppointmentCalendar onCreateAppointment={handleOpenModal} />
      </div>
    </FadeWrapper>
  );
};

export default Appointments;
