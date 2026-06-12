import { useState } from 'react';

import dayjs from 'dayjs';

import { useSearchParams } from 'react-router';

import { Button, Card, Divider, Result, Spin, Tag, Typography } from 'antd';
import { Calendar, Clock, MapPin, type LucideIcon } from 'lucide-react';

import { APPOINTMENT_STATUS } from '@constants/APPOINTMENT_STATUS';

import { getApiError } from '@functions/getApiError';

import type { TAppointmentType } from '@interfaces/Appointment.interface';

import { useNotificationContext } from '@contexts/NotificationContext';

import {
  useConfirmAppointment,
  useDeclineAppointment,
  usePublicAppointment,
} from '@store/PublicAppointment.store';

import PublicLayout from '@components/Layout/PublicLayout';
import InitialsAvatar from '@components/InitialsAvatar';
import FadeWrapper from '@components/FadeWrapper';
import PopConfirmDefault from '@components/PopConfirmDefault';

const { Title, Text } = Typography;

const TYPE_LABEL: Record<TAppointmentType, string> = {
  DEFAULT: 'Consulta',
  RETURN: 'Retorno',
  URGENT: 'Emergência',
};

const TYPE_COLOR: Record<TAppointmentType, string> = {
  DEFAULT: 'blue',
  RETURN: 'gold',
  URGENT: 'red',
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
    <Icon size={16} className="mt-0.5 shrink-0 text-gray-400" />
    <div className="flex min-w-0 flex-col">
      <Text type="secondary" className="text-xs!">
        {label}
      </Text>
      <Text className="text-sm!">{children}</Text>
    </div>
  </div>
);

const ConfirmAppointment = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { notify } = useNotificationContext();

  const { data, isLoading, isError, error } = usePublicAppointment(token);
  const confirm = useConfirmAppointment();
  const decline = useDeclineAppointment();

  const [outcome, setOutcome] = useState<'confirmed' | 'declined' | null>(null);

  const shell = (node: React.ReactNode) => (
    <PublicLayout>
      <FadeWrapper className="">
        <div className="flex h-full items-center justify-center p-4">
          <div className="w-full max-w-md">{node}</div>
        </div>
      </FadeWrapper>
    </PublicLayout>
  );

  const onConfirm = async () => {
    try {
      await confirm.mutateAsync(token);
      setOutcome('confirmed');
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível confirmar',
        description: getApiError(err),
      });
    }
  };

  const onDecline = async () => {
    try {
      await decline.mutateAsync(token);
      setOutcome('declined');
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível cancelar',
        description: getApiError(err),
      });
    }
  };

  if (!token) {
    return shell(
      <Card variant="outlined">
        <Result
          status="error"
          title="Link inválido"
          subTitle="Este link de confirmação está incompleto. Verifique se abriu o endereço completo enviado no e-mail."
        />
      </Card>,
    );
  }

  if (isLoading) {
    return shell(
      <div className="flex justify-center py-16">
        <Spin size="large" />
      </div>,
    );
  }

  if (isError || !data) {
    return shell(
      <Card variant="outlined">
        <Result
          status="error"
          title="Não foi possível carregar"
          subTitle={getApiError(error, 'Link inválido ou expirado.')}
        />
      </Card>,
    );
  }

  if (outcome === 'confirmed' || data.status === APPOINTMENT_STATUS.CONFIRMED) {
    return shell(
      <Card variant="outlined">
        <Result
          status="success"
          title="Presença confirmada!"
          subTitle="Obrigado por confirmar. Você já pode fechar esta página."
        />
      </Card>,
    );
  }

  if (outcome === 'declined' || data.status === APPOINTMENT_STATUS.CANCELED) {
    return shell(
      <Card variant="outlined">
        <Result
          status="info"
          title="Agendamento cancelado"
          subTitle="Avisamos a clínica que você não poderá comparecer. O horário foi liberado."
        />
      </Card>,
    );
  }

  if (data.status !== APPOINTMENT_STATUS.SCHEDULED) {
    return shell(
      <Card variant="outlined">
        <Result
          status="warning"
          title="Confirmação indisponível"
          subTitle="Este agendamento não está mais disponível para confirmação. Em caso de dúvida, entre em contato com a clínica."
        />
      </Card>,
    );
  }

  const start = dayjs(data.startsAt);
  const end = dayjs(data.endsAt);
  const busy = confirm.isPending || decline.isPending;

  return shell(
    <Card variant="outlined" classNames={{ body: 'flex flex-col gap-4' }}>
      <div className="flex flex-col items-center gap-1 text-center">
        <Title level={4} className="mb-0!">
          {data.clinic?.name ?? 'Clínica'}
        </Title>
        <Text type="secondary" className="text-xs!">
          Confirme sua presença na consulta abaixo
        </Text>
      </div>

      <Divider className="my-0!" />

      <div className="flex items-center gap-3">
        <InitialsAvatar name={data.professional.name} size={44} fontSize={16} />
        <div className="flex min-w-0 flex-col">
          <Text strong>{data.professional.name}</Text>
          {data.specialty && (
            <Text type="secondary" className="text-xs!">
              {data.specialty}
            </Text>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <InfoRow icon={Calendar} label="Data">
          {start.format('DD/MM/YYYY')}
        </InfoRow>
        <InfoRow icon={Clock} label="Horário">
          {`${start.format('HH:mm')} às ${end.format('HH:mm')}`}
        </InfoRow>
        {data.clinic?.address && (
          <InfoRow icon={MapPin} label="Local">
            {data.clinic.address}
          </InfoRow>
        )}
        <div>
          <Tag color={TYPE_COLOR[data.type]}>{TYPE_LABEL[data.type]}</Tag>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="primary"
          block
          loading={confirm.isPending}
          disabled={decline.isPending}
          onClick={onConfirm}
        >
          Confirmar presença
        </Button>
        <PopConfirmDefault
          title="Não poderei comparecer"
          description="Deseja avisar a clínica? O horário será liberado."
          disabled={busy}
          onConfirm={onDecline}
        >
          <Button block danger loading={decline.isPending} disabled={confirm.isPending}>
            Não poderei comparecer
          </Button>
        </PopConfirmDefault>
      </div>
    </Card>,
  );
};

export default ConfirmAppointment;
