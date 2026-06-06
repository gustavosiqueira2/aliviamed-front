import { useEffect } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Divider, Modal, Typography } from 'antd';
import { Clock, MoveRight } from 'lucide-react';

import { DAY_HOURS } from '@constants/DAY_HOURS';

import { getFutureHoursWithDiff } from '@functions/getFutureHoursWithDiff';
import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useCreateAppointment } from '@store/Appointment.store';

import ProfessionalSelect from '@components/ProfessionalSelect';
import SelectInput from '@components/Form/SelectInput';
import PatientSelect from '@components/PatientSelect';
import DateInput from '@components/Form/DateInput';

import {
  CreateAppointmentSchema,
  type CreateAppointmentForm,
} from './CreateAppointmentSchema';

const { Text } = Typography;

type TCreateAppointmentModalProps = {
  open: boolean;
  onCancel: () => void;
  initialStartDate?: Dayjs;
};

const CreateAppointmentModal: React.FC<TCreateAppointmentModalProps> = (
  props,
) => {
  const { open, onCancel, initialStartDate } = props;

  const { notify } = useNotificationContext();

  const { isPending, mutateAsync: createAppointment } = useCreateAppointment();

  const { control, handleSubmit, reset, formState } =
    useForm<CreateAppointmentForm>({
      resolver: zodResolver(CreateAppointmentSchema),
    });

  const startHour = useWatch({
    control,
    name: 'startHour',
  });

  useEffect(() => {
    if (!initialStartDate || !open) {
      reset({});
      return;
    }

    reset({
      date: initialStartDate.toDate(),
      startHour: initialStartDate.format('HH:mm'),
      endHour: initialStartDate.add(1, 'hour').format('HH:mm'),
    });
  }, [initialStartDate, reset, open]);

  const onSubmit: SubmitHandler<CreateAppointmentForm> = async (data) => {
    try {
      await createAppointment(data);

      const [startHourValue, startMinuteValue] = data.startHour.split(':');
      const startsAt = dayjs(data.date)
        .hour(Number(startHourValue))
        .minute(Number(startMinuteValue))
        .second(0)
        .millisecond(0);

      notify({
        type: 'success',
        title: 'Sucesso!',
        description: (
          <>
            Agendamento as <b>{startsAt.format('DD/MM/YYYY [ás] HH:mm')}</b>{' '}
            criado!
          </>
        ),
      });

      onCancel();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema!',
        description: getApiError(err, 'Não foi possível agendar'),
      });
    }
  };

  const possibleEndTimes = getFutureHoursWithDiff(startHour);

  return (
    <Modal
      footer={null}
      title="Marcar agendamento"
      open={open}
      onCancel={() => !isPending && onCancel()}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
        <div className="mb-2 flex items-end gap-2">
          <div className="flex flex-1 flex-col">
            <Text>Profissional</Text>
            <ProfessionalSelect control={control} name="professionalId" />
          </div>

          <Button type="primary">Cadastrar novo</Button>
        </div>
        <div className="mb-6 flex items-end gap-2">
          <div className="flex flex-1 flex-col">
            <Text>Paciente</Text>
            <PatientSelect control={control} name="patientId" />
          </div>

          <Button type="primary">Cadastrar novo</Button>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <Clock size={18} className="text-gray-400!" />

          <div className="flex-1">
            <DateInput disabled={isPending} control={control} name="date" />
          </div>

          <div className="flex items-end">
            <div className="flex flex-1 items-center gap-2">
              <div className="w-22">
                <SelectInput
                  disabled={isPending}
                  control={control}
                  name="startHour"
                  id="new_appointment_start_input"
                  aria-label="horário de início da consulta"
                  placeholder="Inicio"
                  options={DAY_HOURS}
                />
              </div>
              <MoveRight size={18} className="text-gray-300" />
              <div className="w-22">
                <SelectInput
                  control={control}
                  name="endHour"
                  id="new_appointment_end_input"
                  aria-label="horário de término da consulta"
                  placeholder="Até"
                  disabled={isPending || !startHour}
                  labelRender={({ value }) => value}
                  options={possibleEndTimes}
                />
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4!" />

        <div className="flex justify-end gap-2">
          <Button disabled={isPending} onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            disabled={isPending || !formState.isValid}
            htmlType="submit"
            type="primary"
          >
            Confirmar apontamento
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAppointmentModal;
