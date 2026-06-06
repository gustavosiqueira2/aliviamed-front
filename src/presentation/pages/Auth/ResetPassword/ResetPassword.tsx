import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Card, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useResetPassword } from '@store/Auth.store';

import TextInput from '@components/Form/TextInput';

import { getApiError } from '@functions/getApiError';

import {
  resetPasswordSchema,
  type TResetPasswordForm,
} from './ResetPasswordSchema';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const token = searchParams.get('token') ?? '';

  const { isPending, mutateAsync } = useResetPassword();

  const { control, handleSubmit } = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit: SubmitHandler<TResetPasswordForm> = async (form) => {
    try {
      await mutateAsync({ token, password: form.password });

      notify({
        type: 'success',
        title: 'Senha redefinida',
        description: 'Sua senha foi alterada. Faça login para continuar.',
      });

      navigate(ROUTE_NAMES.SIGN_IN, { replace: true });
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível redefinir',
        description: getApiError(err, 'Link inválido ou expirado'),
      });
    }
  };

  if (!token) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card variant="outlined" className="max-w-105">
          <Title level={3} className="mb-1!">
            Link inválido
          </Title>
          <Text>
            Este link de recuperação está incompleto ou expirou. Solicite um
            novo na tela de login.
          </Text>
          <div className="mt-4 flex justify-center">
            <Link to={ROUTE_NAMES.FORGOT_PASSWORD}>
              <Button type="primary">Solicitar novo link</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full items-center justify-center"
    >
      <Card
        variant="outlined"
        className="max-w-105"
        classNames={{ body: 'flex flex-col' }}
      >
        <Title level={3} className="mb-1!">
          Redefinir senha
        </Title>
        <Text>Crie uma nova senha para a sua conta.</Text>

        <div className="mt-4 mb-4 flex flex-col gap-2">
          <TextInput
            label="Nova senha"
            type="password"
            name="password"
            autoComplete="new-password"
            control={control}
            disabled={isPending}
          />
          <TextInput
            label="Confirmar nova senha"
            type="password"
            name="confirmPassword"
            autoComplete="off"
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
          {isPending ? 'Salvando' : 'Redefinir senha'}
        </Button>
      </Card>
    </form>
  );
};

export default ResetPassword;
