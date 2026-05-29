import { useCallback, useEffect, useRef, useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import type { ResultStatusType } from 'antd/es/result';
import { Button, Result, Spin } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useCreateConsult } from '@store/Consult';

import FadeWrapper from '@components/FadeWrapper';

const StartConsult = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const { mutateAsync: createConsultAsync } = useCreateConsult();

  const creationTriggered = useRef(false);

  const [errMessage, setErrMessage] = useState<string>();
  const [errDescription, setErrDescription] = useState<string>();
  const [errStatus, setErrStatus] = useState<ResultStatusType>();

  const createConsult = useCallback(
    async (appointmentId: string) => {
      try {
        await createConsultAsync(appointmentId);

        navigate(`${ROUTE_NAMES.CONSULT}/${appointmentId}`);
      } catch (err) {
        const apiMessage = getApiError(err);
        setErrMessage(apiMessage);

        if (errMessage) {
          console.log('2');
          notify({
            type: 'error',
            title: 'Houve um problema',
            description: 'Não foi possível criar a consulta no momento!',
          });
        }

        if (
          apiMessage === 'O profissional já possui uma consulta em andamento'
        ) {
          setErrStatus('info');
          setErrDescription(
            'Você precisa fechar as consultas em andamento para iniciar uma nova',
          );
        }
      }
    },
    [createConsultAsync, notify, navigate, errMessage],
  );

  useEffect(() => {
    if (!appointmentId) {
      navigate(ROUTE_NAMES['/']);

      return;
    }

    if (!creationTriggered.current) {
      creationTriggered.current = true;

      createConsult(appointmentId);
    }
  }, [appointmentId, navigate, createConsult]);

  if (!appointmentId) return;

  return (
    <FadeWrapper className="flex items-center justify-center">
      {errMessage ? (
        <Result
          status={errStatus}
          title={errMessage}
          subTitle={errDescription}
          extra={[
            <Button onClick={() => navigate(ROUTE_NAMES['/'])}>Voltar</Button>,
            <Button type="primary" onClick={() => createConsult(appointmentId)}>
              Tentar novamente
            </Button>,
          ]}
        />
      ) : (
        <Spin description="Começando consulta..." size="large" />
      )}
    </FadeWrapper>
  );
};

export default StartConsult;
