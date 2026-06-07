import { useEffect, useMemo, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';

import { Button, Divider, Modal, Tag, theme, Typography } from 'antd';
import { CalendarDays, MoveRight, Plus } from 'lucide-react';

import { DAY_HOURS } from '@constants/DAY_HOURS';

import { getApiError } from '@functions/getApiError';
import { getFutureHoursWithDiff } from '@functions/getFutureHoursWithDiff';
import { formatCurrency } from '@functions/formatCurrency';

import { useNotificationContext } from '@contexts/NotificationContext';
import { useTheme } from '@contexts/ThemeContext';

import { useCreateAppointment } from '@store/Appointment.store';

import type { TAppointmentType } from '@interfaces/Appointment.interface';
import type { TClinicSearchProfessional } from '@interfaces/Clinic.interface';

import DateInput from '@components/Form/DateInput';
import MoneyInput from '@components/Form/MoneyInput';
import SelectInput from '@components/Form/SelectInput';
import InitialsAvatar from '@components/InitialsAvatar';
import PatientSelect from '@components/PatientSelect';
import ProfessionalSelect from '@components/ProfessionalSelect';

import {
  CreateAppointmentSchema,
  type CreateAppointmentForm,
} from './CreateAppointmentSchema';

const { Title, Text } = Typography;

const APPOINTMENT_TYPES: {
  value: TAppointmentType;
  label: string;
  color: string;
}[] = [
  { value: 'DEFAULT', label: 'Padrão', color: 'blue' },
  { value: 'RETURN', label: 'Retorno', color: 'green' },
  { value: 'URGENT', label: 'Emergência', color: 'red' },
];

const formatDuration = (minutes: number) => {
  if (minutes <= 0) return '';

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest}min`;
  if (rest === 0) return `${hours}h`;

  return `${hours}h${rest}`;
};

type TCreateAppointmentModalProps = {
  open: boolean;
  onCancel: () => void;
  initialStartDate?: Dayjs;
};

const CreateAppointmentModal: React.FC<TCreateAppointmentModalProps> = (
  props,
) => {
  const { open, onCancel, initialStartDate } = props;

  const { isDark } = useTheme();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { notify } = useNotificationContext();

  const { isPending, mutateAsync: createAppointment } = useCreateAppointment();

  const [selectedProfessional, setSelectedProfessional] =
    useState<TClinicSearchProfessional | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { control, handleSubmit, reset, setValue, formState } =
    useForm<CreateAppointmentForm>({
      resolver: zodResolver(CreateAppointmentSchema),
      mode: 'onChange',
    });

  const startHour = useWatch({ control, name: 'startHour' });
  const endHour = useWatch({ control, name: 'endHour' });
  const date = useWatch({ control, name: 'date' });
  const type = useWatch({ control, name: 'type' });
  const price = useWatch({ control, name: 'price' });

  useEffect(() => {
    setSelectedProfessional(null);
    setSelectedPatient(null);

    if (open && initialStartDate) {
      reset({
        type: 'DEFAULT',
        date: initialStartDate.toDate(),
        startHour: initialStartDate.format('HH:mm'),
        endHour: initialStartDate.add(1, 'hour').format('HH:mm'),
      });
      return;
    }

    reset({ type: 'DEFAULT' });
  }, [initialStartDate, reset, open]);

  useEffect(() => {
    if (!selectedProfessional) return;

    const priceByType: Record<TAppointmentType, number | null> = {
      DEFAULT: selectedProfessional.defaultAppointmentPrice,
      RETURN: selectedProfessional.returnAppointmentPrice,
      URGENT: selectedProfessional.urgentAppointmentPrice,
    };

    setValue('price', priceByType[type ?? 'DEFAULT'] ?? null);
  }, [selectedProfessional, type, setValue]);

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

  const typeConfig = APPOINTMENT_TYPES.find(
    (item) => item.value === (type ?? 'DEFAULT'),
  );

  const scheduleSummary = useMemo(() => {
    if (!date || !startHour || !endHour) return null;

    const day = dayjs(date).format('ddd, D MMM');
    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);

    const [startH, startM] = startHour.split(':').map(Number);
    const [endH, endM] = endHour.split(':').map(Number);
    const minutes = endH * 60 + endM - (startH * 60 + startM);

    return { dayLabel, duration: formatDuration(minutes) };
  }, [date, startHour, endHour]);

  return (
    <Modal
      footer={null}
      title={null}
      open={open}
      onCancel={() => !isPending && onCancel()}
      width={780}
      className="max-w-[95vw]!"
      classNames={{ container: 'p-0! overflow-hidden' }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-x-6 md:flex-row">
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Title level={4} className="my-0!">
              Marcar agendamento
            </Title>

            <div className="flex items-end gap-2">
              <div className="flex flex-1 flex-col">
                <Text>Profissional</Text>
                <ProfessionalSelect
                  control={control}
                  name="professionalId"
                  onSelected={setSelectedProfessional}
                />
              </div>

              <Button type="primary" icon={<Plus size={16} />} />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex flex-1 flex-col">
                <Text>Paciente</Text>
                <PatientSelect
                  control={control}
                  name="patientId"
                  onSelected={setSelectedPatient}
                />
              </div>

              <Button type="primary" icon={<Plus size={16} />} />
            </div>

            <div className="flex flex-col">
              <Text>Data</Text>
              <DateInput disabled={isPending} control={control} name="date" />
            </div>

            <div className="flex flex-col">
              <Text>Horário</Text>
              <div className="flex items-center gap-2">
                <div className="flex-1">
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

                <div className="flex-1">
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

            <div className="flex flex-col gap-1">
              <Text>Tipo de consulta</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { value, onChange } }) => (
                  <div className="flex gap-2">
                    {APPOINTMENT_TYPES.map((item) => (
                      <Button
                        key={item.value}
                        disabled={isPending}
                        type={value === item.value ? 'primary' : 'default'}
                        onClick={() => onChange(item.value)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="flex flex-col">
              <MoneyInput
                control={control}
                name="price"
                optional
                label="Valor da consulta"
                disabled={isPending}
              />
              <Text type="secondary" className="mt-1! text-xs!">
                Valor preenchido conforme o profissional e o tipo da consulta.
              </Text>
            </div>
          </div>

          <div
            style={{
              backgroundColor: colorBgContainer,
              border: isDark ? 'none' : '',
            }}
            className="flex w-full flex-col gap-4 border-gray-200 p-4 pt-0 md:w-64 md:border-l md:pt-4 md:pl-6"
          >
            <div className="flex flex-1 flex-col gap-4">
              <Text type="secondary" strong>
                Resumo
              </Text>

              <div className="flex items-center gap-2">
                {selectedProfessional ? (
                  <>
                    <InitialsAvatar name={selectedProfessional.name} />
                    <div className="flex flex-col">
                      <Text strong>{selectedProfessional.name}</Text>
                      <Text type="secondary" className="text-xs!">
                        Profissional
                      </Text>
                    </div>
                  </>
                ) : (
                  <Text type="secondary" className="text-sm!">
                    Selecione um profissional
                  </Text>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedPatient ? (
                  <>
                    <InitialsAvatar name={selectedPatient.name} />
                    <div className="flex flex-col">
                      <Text strong>{selectedPatient.name}</Text>
                      <Text type="secondary" className="text-xs!">
                        Paciente
                      </Text>
                    </div>
                  </>
                ) : (
                  <Text type="secondary" className="text-sm!">
                    Selecione um paciente
                  </Text>
                )}
              </div>

              {scheduleSummary && (
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="shrink-0 text-gray-400" />
                  <Text className="text-sm!">
                    {scheduleSummary.dayLabel} · {startHour} – {endHour}
                    {scheduleSummary.duration &&
                      ` · ${scheduleSummary.duration}`}
                  </Text>
                </div>
              )}

              {typeConfig && (
                <Tag color={typeConfig.color} className="w-fit">
                  {typeConfig.label}
                </Tag>
              )}
            </div>

            <Divider className="my-0!" />

            <div className="flex flex-col">
              <Text type="secondary" className="text-xs!">
                Valor da consulta
              </Text>
              <Title level={3} className="my-0!">
                {price != null ? formatCurrency(price) : '—'}
              </Title>
            </div>

            <div className="mt-auto flex flex-col gap-1">
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                disabled={isPending || !formState.isValid}
              >
                Confirmar agendamento
              </Button>
              <Button type="text" disabled={isPending} onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAppointmentModal;
