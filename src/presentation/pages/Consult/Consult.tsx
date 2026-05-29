import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { useNavigate, useParams } from 'react-router';

import { useForm, useWatch } from 'react-hook-form';

import { Save, UserRound } from 'lucide-react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Empty,
  Popconfirm,
  theme,
  Typography,
} from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import {
  useConsultByAppointmentId,
  useFinishConsult,
  useUpdateConsult,
} from '@store/Consult';

import { useDebounce } from '@hooks/useDebounce';

import TextAreaInput from '@components/Form/TextAreaInput';
import FadeWrapper from '@components/FadeWrapper';

import Timer from './Timer';
import { useNotificationContext } from '@contexts/NotificationContext';

const { Title, Paragraph, Text } = Typography;

type TConsultForm = {
  complaint?: null | string;
  evolution?: null | string;
  diagnosis?: null | string;
  prescription?: null | string;
  notes?: null | string;
};

const Consult = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { data: consult } = useConsultByAppointmentId(appointmentId!);
  const { mutateAsync: finishConsultAsync, isPending: isPendingFinish } =
    useFinishConsult();
  const { mutate: updateConsult, mutateAsync: updateConsultAsync } =
    useUpdateConsult();

  const [isFinishingConsultation, setIsFinishingConsultation] = useState(false);

  const { control, reset, formState } = useForm<TConsultForm>();

  const values = useWatch({
    control: control,
  });

  const debouncedValues = useDebounce(values, 1500);

  useEffect(() => {
    reset({
      complaint: consult?.complaint,
      evolution: consult?.evolution,
      diagnosis: consult?.diagnosis,
      prescription: consult?.prescription,
      notes: consult?.notes,
    });
  }, [reset, consult]);

  useEffect(() => {
    if (!consult) return;
    if (!formState.isDirty) return;
    if (isFinishingConsultation) return;

    updateConsult(
      {
        id: consult.id,
        payload: debouncedValues,
      },
      {
        onSuccess: () => {
          notify({
            type: 'success',
            title: `Consulta salva`,
            description: 'Salvamento automático concluído',
          });
          reset(debouncedValues);
        },
      },
    );

    //eslint-disable-next-line
  }, [debouncedValues, isFinishingConsultation]);

  if (!appointmentId) {
    navigate(ROUTE_NAMES['/']);

    return;
  }

  if (!consult) return;

  const handleFinish = async () => {
    try {
      setIsFinishingConsultation(true);

      if (Object.values(values).find((v) => !!v)) {
        await updateConsultAsync({ id: consult.id, payload: values });
      }

      await finishConsultAsync(consult);

      navigate(ROUTE_NAMES['/']);
      notify({
        type: 'success',
        title: 'Pronto',
        description: 'Consulta finalizada com sucesso!',
      });
    } finally {
      setIsFinishingConsultation(false);
    }
  };

  const { patient } = consult;

  return (
    <FadeWrapper>
      <form className="pr-1 pb-6">
        <div className="flex items-center justify-between">
          <Title level={2} className="mb-0!">
            Consulta em andamento
          </Title>

          <Timer start={dayjs(consult.startedAt)} />
        </div>

        <div className="mt-2 flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <Card>
              <div className="flex items-center gap-4">
                <Avatar size={64} className="bg-blue-200/50!">
                  <UserRound size={32} className="text-blue-500" />
                </Avatar>

                <div className="flex flex-col">
                  <Title level={4} className="my-0!">
                    {patient.name}
                  </Title>

                  <Paragraph className="my-0!">
                    Data de Nascimento:{' '}
                    {dayjs(patient.birthdate).toDate().toLocaleDateString()}
                  </Paragraph>
                </div>
              </div>
            </Card>

            <Alert
              showIcon
              icon={<Save size={18} color={colorPrimary} />}
              title={
                <Text style={{ color: colorPrimary }}>
                  <b>Atenção:</b> As alterações são salvas automaticamente!{' '}
                  <span className="font-normal!">
                    (um ícone apareça durante os salvamentos)
                  </span>
                </Text>
              }
            />

            <div className="flex gap-2">
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Motivo da consulta
                </Title>

                <TextAreaInput control={control} name="complaint" rows={8} />
              </Card>
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Evolução clínica
                </Title>

                <TextAreaInput control={control} name="evolution" rows={8} />
              </Card>
            </div>
            <div className="flex gap-2">
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Diagnóstico
                </Title>

                <TextAreaInput control={control} name="diagnosis" rows={8} />
              </Card>
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Prescrição
                </Title>

                <TextAreaInput control={control} name="prescription" rows={8} />
              </Card>
            </div>

            <Card className="flex-1">
              <Title level={4}>Observações</Title>

              <TextAreaInput control={control} name="notes" rows={4} />
            </Card>
          </div>

          <Card
            className="min-w-80"
            classNames={{ body: 'flex h-full flex-col' }}
          >
            <Title level={5}>Outras consultas</Title>

            <div className="flex flex-1 items-center justify-center">
              <Empty description="Esse paciente não possui consultas anteriores" />
            </div>
          </Card>
        </div>

        <div className="mt-4 flex justify-end">
          <Popconfirm
            title="Confirmar"
            description="Tem certeza que deseja finalizar a consulta?"
            okText="Finalizar"
            cancelText="Cancelar"
            onConfirm={handleFinish}
          >
            <Button type="primary" size="large" disabled={isPendingFinish}>
              Finalizar
            </Button>
          </Popconfirm>
        </div>
      </form>
    </FadeWrapper>
  );
};

export default Consult;
