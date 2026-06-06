import dayjs from 'dayjs';

import { APPOINTMENT_STATUS } from '@constants/APPOINTMENT_STATUS';

import { useAppointments } from '@store/Appointment.store';
import { useActiveConsult } from '@store/Consult.store';
import { useAuth } from '@store/Auth.store';

import FadeWrapper from '@components/FadeWrapper';

import DayAppointmentsCard from './components/DayAppointmentsCard';
import OpenedConsultCard from './components/OpenedConsultCard';
import OnboardCard from './components/OnboardCard';
import QueueCard from './components/QueueCard';

const Home = () => {
  const { data: auth } = useAuth();

  const { data: activeConsult } = useActiveConsult();
  const [appointments] = useAppointments([dayjs()], {
    professionalId: auth?.user.id,
  });

  const dayAppointments = appointments.data ? appointments.data.data : [];
  const queueAppointments = appointments.data
    ? appointments.data.data.filter(
        (a) => a.status === APPOINTMENT_STATUS.WAITING_CONSULTATION,
      )
    : [];

  return (
    <FadeWrapper>
      <div className="flex flex-col gap-4">
        <OnboardCard />

        {!!activeConsult && (
          <OpenedConsultCard
            patientName={activeConsult.patient.name}
            appointmentId={activeConsult.appointment.id}
          />
        )}

        <div className="flex gap-4">
          <DayAppointmentsCard appointments={dayAppointments} />

          <QueueCard
            appointments={queueAppointments}
            isAConsultActive={!!activeConsult}
          />
        </div>
      </div>
    </FadeWrapper>
  );
};

export default Home;
