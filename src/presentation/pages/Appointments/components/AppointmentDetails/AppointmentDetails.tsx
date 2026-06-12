import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { useNavigate } from 'react-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import { Button, Card, Tooltip, Typography } from 'antd';
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { APPOINTMENT_STATUS } from '@constants/APPOINTMENT_STATUS';
import { PERMISSIONS } from '@constants/PERMISSIONS';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { DAY_HOURS } from '@constants/DAY_HOURS';

import { canChangeAppointmentStatus } from '@functions/canChangeAppointmentStatus ';
import { translateAppointmentStatus } from '@functions/translateAppointmentStatus';
import { getFutureHoursWithDiff } from '@functions/getFutureHoursWithDiff';
import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import type {
  TAppointment,
  TAppointmentStatusChange,
  TAppointmentType,
} from '@interfaces/Appointment.interface';

import {
  useAppointment,
  useChangeAppointmentStatus,
  useRescheduleAppointment,
} from '@store/Appointment.store';

import CancelAppointmentModal from '@components/Modal/CancelAppointmentModal';
import PopConfirmDefault from '@components/PopConfirmDefault';
import InitialsAvatar from '@components/InitialsAvatar';
import SelectInput from '@components/Form/SelectInput';
import DateInput from '@components/Form/DateInput';
import FadeWrapper from '@components/FadeWrapper';
import Can from '@components/Can/Can';

import AppointmentDetailsEmpty from './components/AppointmentDetailsEmpty';
import AppointmentDetailsInfo from './components/AppointmentDetailsInfo';
import AppointmentStatusSteps from './components/AppointmentStatusSteps';
import {
  RescheduleAppointmentSchema,
  type RescheduleAppointmentForm,
} from './RescheduleAppointmentSchema';

const { Title, Text, Link: LinkText } = Typography;

const TYPE_LABELS: Record<TAppointmentType, string> = {
  DEFAULT: 'Consulta',
  RETURN: 'Retorno',
  URGENT: 'Urgência',
};

const InfoRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <Icon size={16} className="mt-1 shrink-0 text-gray-400" />
    <div className="flex min-w-0 flex-1 flex-col">
      <Text type="secondary" className="text-xs!">
        {label}
      </Text>
      <div className="text-xs!">{children}</div>
    </div>
  </div>
);

type TAppointmentDetailsProps = {
  appointment?: TAppointment;
  onChangeAppointmentStatus: (status: keyof typeof APPOINTMENT_STATUS) => void;
};

const AppointmentDetails: React.FC<TAppointmentDetailsProps> = (props) => {
  const { appointment, onChangeAppointmentStatus } = props;

  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const { data: detail } = useAppointment(appointment?.id);

  const { control, setValue, handleSubmit, reset, formState } =
    useForm<RescheduleAppointmentForm>({
      resolver: zodResolver(RescheduleAppointmentSchema),
      mode: 'onChange',
    });

  const startHour = useWatch({ control, name: 'startHour' });

  const { mutateAsync: rescheduleAppointment } = useRescheduleAppointment();
  const { mutateAsync: changeAppointmentStatus, isPending } =
    useChangeAppointmentStatus();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    reset();

    if (appointment) {
      setIsRescheduling(false);

      setValue('date', dayjs(appointment.startsAt).toDate());
      setValue('startHour', dayjs(appointment.startsAt).format('HH:mm'));
      setValue('endHour', dayjs(appointment.endsAt).format('HH:mm'));
    }
  }, [appointment, reset, setValue]);

  const handleChangeStatus = async (
    status: TAppointmentStatusChange,
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

  const renderBody = (appointment: TAppointment) => {
    const { status } = appointment;

    const durationMin = dayjs(appointment.endsAt).diff(
      dayjs(appointment.startsAt),
      'minute',
    );
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;
    const durationLabel = hours
      ? minutes
        ? `${hours}h${minutes}`
        : `${hours}h`
      : `${minutes}min`;

    const dateLabel = dayjs(appointment.startsAt).format('dddd, DD MMM YYYY');

    const subtitle = [TYPE_LABELS[appointment.type], detail?.specialty]
      .filter(Boolean)
      .join(' · ');

    const phoneDigits = detail?.patient.phone?.replace(/\D/g, '');

    const canOpenConsult =
      status === APPOINTMENT_STATUS.COMPLETED ||
      status === APPOINTMENT_STATUS.IN_CONSULTATION;

    return (
      <FadeWrapper
        duration={0.1}
        key="details"
        className="relative w-70 overflow-auto p-4"
      >
        <form
          onSubmit={handleSubmit(handleReschedule)}
          className="flex h-full flex-col"
        >
          <Card className="-m-1!" classNames={{ body: 'p-2!' }}>
            <div className="flex items-center gap-3">
              <InitialsAvatar
                name={appointment.patient.name}
                size={28}
                fontSize={10}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <Title level={5} className="my-0! truncate text-xs!">
                    {appointment.patient.name}
                  </Title>

                  <LinkText
                    className="text-xs! whitespace-nowrap"
                    onClick={() =>
                      navigate(
                        `${ROUTE_NAMES.PATIENTS}/${appointment.patient.id}`,
                      )
                    }
                  >
                    ver →
                  </LinkText>
                </div>

                {subtitle && (
                  <Text type="secondary" className="text-xs!">
                    {subtitle}
                  </Text>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Text type="secondary" className="text-xs! font-semibold!">
                Status
              </Text>

              <Text className="text-xs!">
                {translateAppointmentStatus(status)}
              </Text>
            </div>

            <AppointmentStatusSteps status={status} />
            {appointment.cancelReason && (
              <Text type="secondary" className="mb-1! text-xs!">
                Motivo do cancelamento: {appointment.cancelReason}
              </Text>
            )}
          </div>

          {!isRescheduling && (
            <AppointmentDetailsInfo
              appointment={appointment}
              patientName={appointment.patient.name}
            />
          )}

          {isRescheduling ? (
            <div className="flex flex-col gap-2">
              <Can permission={PERMISSIONS.APPOINTMENT_RESCHEDULE}>
                <Button
                  disabled={!formState.isValid}
                  type="primary"
                  htmlType="submit"
                >
                  Salvar reagendamento
                </Button>
              </Can>
              <Button onClick={() => setIsRescheduling(false)}>Cancelar</Button>
            </div>
          ) : (
            <div className="flex flex-col">
              {canOpenConsult && (
                <Can permission={PERMISSIONS.CONSULT_VIEW}>
                  <Button
                    type="primary"
                    block
                    icon={<FileText size={16} />}
                    onClick={() =>
                      navigate(`${ROUTE_NAMES.CONSULT}/${appointment.id}`)
                    }
                    className="mt-2"
                  >
                    Abrir prontuário
                  </Button>
                </Can>
              )}

              <div className="flex gap-2">
                {canChangeAppointmentStatus(status, 'confirm') && (
                  <Can permission={PERMISSIONS.APPOINTMENT_MANAGE_STATUS}>
                    <PopConfirmDefault
                      title="Confirmar"
                      description="Tem certeza que confirmar o Agendamento?"
                      disabled={isPending}
                      onConfirm={() =>
                        handleChangeStatus(APPOINTMENT_STATUS.CONFIRMED)
                      }
                    >
                      <Button type="primary" className="mt-2 flex-1">
                        Confirmar
                      </Button>
                    </PopConfirmDefault>
                  </Can>
                )}

                {canChangeAppointmentStatus(status, 'waitingConsultation') && (
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
                        title="Colocar o paciente na fila de espera"
                      >
                        <Button type="primary" className="mt-2 flex-1">
                          Check-in
                        </Button>
                      </Tooltip>
                    </PopConfirmDefault>
                  </Can>
                )}
              </div>

              {canChangeAppointmentStatus(status, 'complete') && (
                <Can permission={PERMISSIONS.APPOINTMENT_MANAGE_STATUS}>
                  <PopConfirmDefault
                    title="Completar"
                    description="Tem certeza que completar o Agendamento?"
                    disabled={isPending}
                    onConfirm={() =>
                      handleChangeStatus(APPOINTMENT_STATUS.COMPLETED)
                    }
                  >
                    <Button block className="mt-2">
                      Completar
                    </Button>
                  </PopConfirmDefault>
                </Can>
              )}

              <div className="flex gap-2">
                {canChangeAppointmentStatus(status, 'cancel') && (
                  <Can permission={PERMISSIONS.APPOINTMENT_CANCEL}>
                    <Button
                      className="mt-2 flex-1"
                      danger
                      disabled={isPending}
                      onClick={() => setIsCanceling(true)}
                    >
                      Cancelar
                    </Button>
                  </Can>
                )}

                {canChangeAppointmentStatus(status, 'noShow') && (
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
                          className="mt-2 flex-1"
                          disabled={dayjs(appointment.endsAt).isAfter(dayjs())}
                        >
                          Ausente
                        </Button>
                      </Tooltip>
                    </PopConfirmDefault>
                  </Can>
                )}
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <Can permission={PERMISSIONS.APPOINTMENT_RESCHEDULE}>
                  <Tooltip
                    placement="bottom"
                    title={
                      canChangeAppointmentStatus(status, 'reschedule')
                        ? ''
                        : 'Não é possível reagendar um agendamento concluído'
                    }
                  >
                    <Button
                      size="small"
                      className="flex-col gap-1! text-xs!"
                      disabled={
                        !canChangeAppointmentStatus(status, 'reschedule')
                      }
                      onClick={() => setIsRescheduling(true)}
                    >
                      Reagendar
                    </Button>
                  </Tooltip>
                </Can>

                <Button
                  size="small"
                  className="flex-col gap-1! text-xs!"
                  disabled={!phoneDigits}
                  href={
                    phoneDigits ? `https://wa.me/55${phoneDigits}` : undefined
                  }
                  target="_blank"
                >
                  WhatsApp
                </Button>

                <Tooltip placement="bottom" title="Em breve">
                  <Button size="small" className="text-xs!" disabled>
                    Recibo
                  </Button>
                </Tooltip>
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-col gap-3">
            <InfoRow icon={Calendar} label="Data">
              {isRescheduling ? (
                <DateInput disabled={isPending} control={control} name="date" />
              ) : (
                <span className="capitalize">{dateLabel}</span>
              )}
            </InfoRow>

            <InfoRow icon={Clock} label="Horário · duração">
              {isRescheduling ? (
                <div className="flex items-center gap-2">
                  <SelectInput
                    disabled={isPending}
                    control={control}
                    name="startHour"
                    placeholder="Início"
                    options={DAY_HOURS}
                    className="flex-1"
                  />
                  <SelectInput
                    control={control}
                    name="endHour"
                    placeholder="Até"
                    disabled={isPending || !startHour}
                    labelRender={({ value }) => value}
                    options={possibleEndTimes}
                    className="flex-1"
                  />
                </div>
              ) : (
                `${dayjs(appointment.startsAt).format('HH:mm')} – ${dayjs(
                  appointment.endsAt,
                ).format('HH:mm')} · ${durationLabel}`
              )}
            </InfoRow>

            <InfoRow icon={UserRound} label="Profissional">
              {appointment.professional.name}
            </InfoRow>

            {detail?.clinic && (
              <InfoRow icon={MapPin} label="Local">
                <div className="flex flex-col">
                  <span>{detail.clinic.name}</span>
                  {detail.clinic.address && (
                    <Text type="secondary" className="text-xs!">
                      {detail.clinic.address}
                    </Text>
                  )}
                </div>
              </InfoRow>
            )}
          </div>

          <div className="mt-auto flex flex-col pt-2 text-[10px] text-gray-400">
            <span>
              Criado em{' '}
              {dayjs(appointment.createdAt).format('DD/MM/YYYY HH:mm')}
            </span>
            <span>ID {appointment.id}</span>
          </div>
        </form>
      </FadeWrapper>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {appointment ? renderBody(appointment) : <AppointmentDetailsEmpty />}
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
