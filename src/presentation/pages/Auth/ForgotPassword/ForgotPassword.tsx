import { Link, useNavigate } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Card, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useForgotPassword } from '@store/Auth.store';

import TextInput from '@components/Form/TextInput';

import { getApiError } from '@functions/getApiError';

import {
  forgotPasswordSchema,
  type TForgotPasswordForm,
} from './ForgotPasswordSchema';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const { isPending, mutateAsync } = useForgotPassword();

  const { control, handleSubmit } = useForm<TForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<TForgotPasswordForm> = async (form) => {
    try {
      const { message } = await mutateAsync({ email: form.email });

      notify({
        type: 'success',
        title: 'Verifique seu e-mail',
        description: message,
      });

      navigate(ROUTE_NAMES.SIGN_IN, { replace: true });
    } catch (err) {
      notify({
        type: 'error',
        title: 'Houve um problema',
        description: getApiError(err, 'Não foi possível enviar o e-mail'),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full items-center justify-center"
    >
      <Card variant="outlined" className="max-w-105">
        <Title level={3} className="mb-1!">
          Recuperar senha
        </Title>
        <Text>
          Informe o e-mail da sua conta e enviaremos um link para você criar uma
          nova senha.
        </Text>

        <div className="mt-4 mb-4 flex flex-col gap-2">
          <TextInput
            required
            label="Email"
            name="email"
            autoComplete="username"
            control={control}
            disabled={isPending}
          />
        </div>

        <Button
          htmlType="submit"
          type="primary"
          loading={isPending}
          className="h-11 w-full"
        >
          {isPending ? 'Enviando' : 'Enviar link'}
        </Button>

        <div className="flex justify-center">
          <Link to={ROUTE_NAMES.SIGN_IN}>
            <Button size="small" type="text" disabled={isPending} className="mt-2">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </Card>
    </form>
  );
};

export default ForgotPassword;
