import { Fragment, useState } from 'react';

import { useSearchParams } from 'react-router';

import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Result,
  Spin,
  Typography,
} from 'antd';

import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import {
  useAnswerFormSubmission,
  usePublicFormSubmission,
} from '@store/Form.store';

import PublicLayout from '@components/Layout/PublicLayout';
import FadeWrapper from '@components/FadeWrapper';

import { renderFormInput } from '@pages/Forms/NewForm/components/renderFormInput';

const { Title, Text } = Typography;

const AnswerForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { notify } = useNotificationContext();

  const { data, isLoading, isError, error } = usePublicFormSubmission(token);
  const answer = useAnswerFormSubmission();

  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      await answer.mutateAsync({ token, answers: values });
      setSubmitted(true);
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível enviar',
        description: getApiError(err),
      });
    }
  };

  const shell = (node: React.ReactNode) => (
    <PublicLayout>
      <FadeWrapper className="">
        <div className="flex h-full items-center justify-center p-4">
          <div className="w-full max-w-2xl">{node}</div>
        </div>
      </FadeWrapper>
    </PublicLayout>
  );

  if (!token) {
    return shell(
      <Card variant="outlined">
        <Result
          status="error"
          title="Link inválido"
          subTitle="Este link de formulário está incompleto. Verifique o endereço enviado no e-mail."
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

  if (submitted || data.status === 'ANSWERED') {
    return shell(
      <Card variant="outlined">
        <Result
          status="success"
          title="Formulário enviado!"
          subTitle="Obrigado por responder. Você já pode fechar esta página."
        />
      </Card>,
    );
  }

  if (data.status === 'EXPIRED') {
    return shell(
      <Card variant="outlined">
        <Result
          status="warning"
          title="Link expirado"
          subTitle="Este formulário não está mais disponível. Entre em contato com a clínica para receber um novo link."
        />
      </Card>,
    );
  }

  return shell(
    <Card variant="outlined">
      <div className="mb-4 flex flex-col items-center text-center">
        <Title level={4} className="mb-0!">
          {data.formName}
        </Title>
        {data.clinicName && (
          <Text type="secondary" className="text-sm!">
            {data.clinicName}
            {data.professionalName ? ` · ${data.professionalName}` : ''}
          </Text>
        )}
      </div>

      <Form layout="vertical" onFinish={onFinish} disabled={answer.isPending}>
        {data.schema.map((group, index) => (
          <Fragment key={group.id}>
            <Divider
              titlePlacement="start"
              className={index === 0 ? 'mt-0!' : undefined}
            >
              <Title level={5} className="mb-0!">
                {group.title}
              </Title>
            </Divider>

            {group.inputs.map((input) => (
              <Form.Item
                key={input.name}
                name={input.name}
                label={input.label}
                rules={
                  input.required
                    ? [{ required: true, message: 'Campo obrigatório' }]
                    : []
                }
                className="mb-3!"
              >
                {renderFormInput(input)}
              </Form.Item>
            ))}
          </Fragment>
        ))}

        <Divider className="mt-2!" />

        <Form.Item
          name="lgpdConsent"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value: boolean) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('É necessário aceitar para enviar')),
            },
          ]}
          className="mb-4!"
        >
          <Checkbox>
            Li e concordo com o tratamento dos meus dados pessoais e dos meus
            dados sensíveis de saúde para fins de atendimento e acompanhamento
            clínico, conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº
            13.709/2018).
          </Checkbox>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={answer.isPending}
        >
          Enviar respostas
        </Button>
      </Form>
    </Card>,
  );
};

export default AnswerForm;
