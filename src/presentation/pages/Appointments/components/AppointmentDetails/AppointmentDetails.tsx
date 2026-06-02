import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import { Button, Divider, Tooltip } from 'antd';
import { Bookmark, Calendar, Clock } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { APPOINTMENT_STATUS } from '@constants/APPOINTMENT_STATUS';
import { EVENT_COLOR } from '@constants/EVENT_COLOR';
import { DAY_HOURS } from '@constants/DAY_HOURS';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import { canChangeAppointmentStatus } from '@functions/canChangeAppointmentStatus ';
import { translateAppointmentStatus } from '@functions/translateAppointmentStatus';
import { getFutureHoursWithDiff } from '@functions/getFutureHoursWithDiff';
import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import {
  useChangeAppointmentStatus,
  useRescheduleAppointment,
  type TAppointment,
  type TChangeStatusOptions,
} from '@store/Appointment';

import Can from '@components/Can/Can';
import PopConfirmDefault from '@components/PopConfirmDefault';
import SelectInput from '@components/Form/SelectInput';
import DateInput from '@components/Form/DateInput';
import FadeWrapper from '@components/FadeWrapper';

import AppointmentDetailsHeader from './components/AppointmentDetailsHeader';
import AppointmentDetailsEmpty from './components/AppointmentDetailsEmpty';
import AppointmentDetailsInfo from './components/AppointmentDetailsInfo';
import CancelAppointmentModal from './CancelAppointmentModal';
import {
  RescheduleAppointmentSchema,
  type RescheduleAppointmentForm,
} from './RescheduleAppointmentSchema';

type TAppointmentDetailsProps = {
  appointment?: TAppointment;
  onCloseDetails: () => void;
  onChangeAppointmentStatus: (status: keyof typeof APPOINTMENT_STATUS) => void;
};

const AppointmentDetails: React.FC<TAppointmentDetailsProps> = (props) => {
  const { appointment, onCloseDetails, onChangeAppointmentStatus } = props;

  const { notify } = useNotificationContext();

  const { control, setValue, handleSubmit, reset, formState } =
    useForm<RescheduleAppointmentForm>({
      resolver: zodResolver(RescheduleAppointmentSchema),
    });

  const startHour = useWatch({
    control,
    name: 'startHour',
  });

  const { mutateAsync: rescheduleAppointment } = useRescheduleAppointment();
  const { mutateAsync: changeAppointmentStatus, isPending } =
    useChangeAppointmentStatus();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    reset();

    if (appointment) {
      setIsRescheduling(false);

      setValue('date', appointment.startsAt);
      setValue('startHour', dayjs(appointment.startsAt).format('HH:mm'));
      setValue('endHour', dayjs(appointment.endsAt).format('HH:mm'));
    }
  }, [appointment, reset, setValue]);

  const handleChangeStatus = async (
    status: TChangeStatusOptions,
    cancelReason?: string,
  ) => {
    try {
      if (!appointment) return;

      await changeAppointmentStatus({ appointment, status, cancelReason });

      notify({
        type: 'success',
        title: 'Sucesso!',
        description: `Agendamento alterado`,
      });

      onChangeAppointmentStatus(status);
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema!',
        description: getApiError(
          err,
          'Não foi possível atualizar o agendamento',
        ),
      });
    }
  };

  const handleReschedule: SubmitHandler<RescheduleAppointmentForm> = async (
    data,
  ) => {
    try {
      if (!appointment) return;

      await rescheduleAppointment({ appointment, ...data });

      notify({
        type: 'success',
        title: 'Sucesso!',
        description: `Agendamento reagendado`,
      });
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema!',
        description: getApiError(err, 'Não foi possível reagendar'),
      });
    }
  };

  const possibleEndTimes = isRescheduling
    ? getFutureHoursWithDiff(startHour)
    : [];

  return (
    <>
      <AnimatePresence mode="wait">
        {appointment ? (
        <FadeWrapper duration={0.1} key="details" className="w-65 p-6 py-4">
          <form
            onSubmit={handleSubmit(handleReschedule, (e) => console.log(e))}
            className="flex h-full flex-col"
          >
            <AppointmentDetailsHeader
              isRescheduling={isRescheduling}
              onReschedule={() => setIsRescheduling(true)}
              onCloseDetails={onCloseDetails}
            />

            <div className="mb-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500">
                <Bookmark
                  size={14}
                  style={{
                    color: EVENT_COLOR[appointment.status],
                  }}
                />
                Status:
                <span
                  style={{
                    color: EVENT_COLOR[appointment.status],
                  }}
                >
                  {translateAppointmentStatus(appointment.status)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} />

                {isRescheduling ? (
                  <DateInput
                    disabled={isPending}
                    control={control}
                    name="date"
                  />
                ) : (
                  dayjs(appointment.startsAt).format('dddd, MMM DD, YYYY')
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} />

                {isRescheduling ? (
                  <div className="flex flex-1 items-center gap-2">
                    <SelectInput
                      disabled={isPending}
                      control={control}
                      name="startHour"
                      id="new_appointment_start_input"
                      aria-label="horário de início da consulta"
                      placeholder="Inicio"
                      options={DAY_HOURS}
                      className="flex-1"
                    />
                    <SelectInput
                      control={control}
                      name="endHour"
                      id="new_appointment_end_input"
                      aria-label="horário de término da consulta"
                      placeholder="Até"
                      disabled={isPending || !startHour}
                      labelRender={({ value }) => value}
                      options={possibleEndTimes}
                      className="flex-1"
                    />
                  </div>
                ) : (
                  `${dayjs(appointment.startsAt).format('HH:mm')} - ${dayjs(appointment.endsAt).format('HH:mm')}`
                )}
              </div>
            </div>

            {isRescheduling ? (
              <div className="mb-3 flex flex-col gap-2">
                <Can permission={PERMISSIONS.APPOINTMENT_RESCHEDULE}>
                  <Button
                    disabled={!formState.isValid}
                    type="primary"
                    htmlType="submit"
                  >
                    Reagendar
                  </Button>
                </Can>

                <Button onClick={() => setIsRescheduling(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="mb-3 flex flex-col gap-2">
                {canChangeAppointmentStatus(appointment.status, 'confirm') && (
                  <Can permission={PERMISSIONS.APPOINTMENT_MANAGE_STATUS}>
                    <PopConfirmDefault
                      title="Cancelar"
                      description="Tem certeza que confirmar o Agendamento?"
                      disabled={isPending}
                      onConfirm={() =>
                        handleChangeStatus(APPOINTMENT_STATUS.CONFIRMED)
                      }
                    >
                      <Button type="primary">Confirmar</Button>
                    </PopConfirmDefault>
                  </Can>
                )}
                {canChangeAppointmentStatus(
                  appointment.status,
                  'waitingConsultation',
                ) && (
                  <Can permission={PERMISSIONS.APPOINTMENT_MANAGE_STATUS}>
                    <PopConfirmDefault
                      title="Check-in"
                      description="Confirmar entrada na fila?"
                      disabled={isPending}
                      onConfirm={() =>
                        handleChangeStatus(
                          APPOINTMENT_STATUS.WAITING_CONSULTATION,
                        )
                      }
                    >
                      <Tooltip
                        placement="bottom"
                        title={'Colocar o paciente na fila de espera'}
                      >
                        <Button type="primary">Check-in</Button>
                      </Tooltip>
                    </PopConfirmDefault>
                  </Can>
                )}
                {canChangeAppointmentStatus(appointment.status, 'complete') && (
                  <Can permission={PERMISSIONS.APPOINTMENT_MANAGE_STATUS}>
                    <PopConfirmDefault
                      title="Completar"
                      description="Tem certeza que completar o Agendamento?"
                      disabled={isPending}
                      onConfirm={() =>
                        handleChangeStatus(APPOINTMENT_STATUS.COMPLETED)
                      }
                    >
                      <Button type="primary">Completar</Button>
                    </PopConfirmDefault>
                  </Can>
                )}
                {canChangeAppointmentStatus(appointment.status, 'noShow') && (
                  <Can permission={PERMISSIONS.APPOINTMENT_MANAGE_STATUS}>
                    <PopConfirmDefault
                      title="Não Compareceu"
                      description="Tem certeza que o paciente não apareceu no Agendamento?"
                      disabled={isPending}
                      onConfirm={() =>
                        handleChangeStatus(APPOINTMENT_STATUS.NO_SHOW)
                      }
                    >
                      <Tooltip
                        placement="bottom"
                        title={
                          dayjs(appointment.endsAt).isAfter(dayjs())
                            ? 'O Data do agendamento ainda não passou!'
                            : ''
                        }
                      >
                        <Button
                          disabled={dayjs(appointment.endsAt).isAfter(dayjs())}
                        >
                          Não apareceu
                        </Button>
                      </Tooltip>
                    </PopConfirmDefault>
                  </Can>
                )}
                {canChangeAppointmentStatus(appointment.status, 'cancel') && (
                  <Can permission={PERMISSIONS.APPOINTMENT_CANCEL}>
                    <Button
                      disabled={isPending}
                      onClick={() => setIsCanceling(true)}
                    >
                      Cancelar
                    </Button>
                  </Can>
                )}
                {canChangeAppointmentStatus(
                  appointment.status,
                  'reschedule',
                ) && (
                  <Can permission={PERMISSIONS.APPOINTMENT_RESCHEDULE}>
                    <Button
                      type="primary"
                      onClick={() => setIsRescheduling(true)}
                    >
                      Reagendar
                    </Button>
                  </Can>
                )}
              </div>
            )}

            <Divider className="my-2!" />

            <AppointmentDetailsInfo appointment={appointment} />
          </form>
        </FadeWrapper>
      ) : (
        <AppointmentDetailsEmpty />
      )}
      </AnimatePresence>

      <CancelAppointmentModal
        open={isCanceling}
        appointment={appointment}
        isPending={isPending}
        onClose={() => setIsCanceling(false)}
        onConfirm={async (cancelReason) => {
          await handleChangeStatus(APPOINTMENT_STATUS.CANCELED, cancelReason);
          setIsCanceling(false);
        }}
      />
    </>
  );
};

export default AppointmentDetails;
