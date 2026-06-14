import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import { useForm, useWatch } from 'react-hook-form';

import { Save } from 'lucide-react';
import { Alert, Button, Card, Popconfirm, theme, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import {
  useConsultByAppointmentId,
  useFinishConsult,
  useUpdateConsult,
} from '@store/Consult.store';
import type { TConsult } from '@interfaces/Consult.interface';
import { usePatient } from '@store/Patient.store';

import { useDebounce } from '@hooks/useDebounce';

import Can from '@components/Can/Can';
import TextAreaInput from '@components/Form/TextAreaInput';
import FadeWrapper from '@components/FadeWrapper';

import { useNotificationContext } from '@contexts/NotificationContext';

import PreviousConsultsList from '@components/Consult/PreviousConsultsList';
import ConsultDetailDrawer from '@components/Consult/ConsultDetailDrawer';

import PatientSummaryHeader from './components/PatientSummaryHeader';

const { Title, Text } = Typography;

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
  const { data: patient } = usePatient(consult?.patient.id ?? '');

  const { mutateAsync: finishConsultAsync, isPending: isPendingFinish } =
    useFinishConsult();
  const { mutate: updateConsult, mutateAsync: updateConsultAsync } =
    useUpdateConsult();

  const [isFinishingConsultation, setIsFinishingConsultation] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState<TConsult | null>(null);

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

  return (
    <FadeWrapper>
      <form className="pr-1 pb-6">
        <Title level={4} className="mb-2!">
          Consulta em andamento
        </Title>

        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <PatientSummaryHeader
              patient={patient ?? consult.patient}
              professionalName={consult.professional.name}
              startedAt={consult.startedAt}
            />

            <Alert
              showIcon
              icon={<Save size={18} color={colorPrimary} />}
              title={
                <Text style={{ color: colorPrimary }}>
                  <b>Atenção:</b> As alterações são salvas automaticamente!{' '}
                  <span className="font-normal!">
                    (um ícone aparece durante os salvamentos)
                  </span>
                </Text>
              }
              style={{
                borderColor: colorPrimary + '40',
                background: colorPrimary + '10',
              }}
            />

            <div className="flex gap-2">
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Motivo da consulta
                </Title>

                <TextAreaInput control={control} name="complaint" rows={6} />
              </Card>
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Evolução clínica
                </Title>

                <TextAreaInput control={control} name="evolution" rows={6} />
              </Card>
            </div>

            <div className="flex gap-2">
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Diagnóstico
                </Title>

                <TextAreaInput control={control} name="diagnosis" rows={6} />
              </Card>
              <Card className="flex-1" classNames={{ body: 'p-4!' }}>
                <Title level={5} className="mb-1!">
                  Prescrição
                </Title>

                <TextAreaInput control={control} name="prescription" rows={6} />
              </Card>
            </div>

            <Card classNames={{ body: 'p-4!' }}>
              <Title level={5} className="mb-1!">
                Observações
              </Title>

              <TextAreaInput control={control} name="notes" rows={6} />
            </Card>
          </div>

          <Card
            className="min-w-80"
            classNames={{ body: 'flex h-full flex-col p-0!' }}
          >
            <div className="p-4 pb-0">
              <Title level={5} className="my-0!">
                Outras consultas
              </Title>
            </div>

            <PreviousConsultsList
              patientId={consult.patient.id}
              currentConsultId={consult.id}
              onSelect={setSelectedConsult}
            />
          </Card>
        </div>

        <div className="mt-4 flex justify-end">
          <Can permission={PERMISSIONS.CONSULT_FINISH}>
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
          </Can>
        </div>
      </form>

      <ConsultDetailDrawer
        consult={selectedConsult}
        open={!!selectedConsult}
        onClose={() => setSelectedConsult(null)}
      />
    </FadeWrapper>
  );
};

export default Consult;
