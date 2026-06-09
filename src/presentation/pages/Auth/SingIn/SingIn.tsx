import { Button, Card, Divider, Typography } from 'antd';

import { Link, useSearchParams } from 'react-router';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { getApiError } from '@functions/getApiError';

import { useAuthUser } from '@store/Auth.store';

import GoogleLoginButton from '@components/GoogleLoginButton';
import TextInput from '@components/Form/TextInput';

import { type TSignInForm, signInSchema } from './SingInSchema';

const { Title, Text } = Typography;

const SingIn = () => {
  const [searchParams] = useSearchParams();

  const { notify } = useNotificationContext();

  const { isPending, mutateAsync: authUser } = useAuthUser();

  const { control, handleSubmit } = useForm<TSignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<TSignInForm> = async (data) => {
    try {
      await authUser(data);
    } catch (err) {
      console.error('🚀 > onSubmit > ERR:', err);

      notify({
        type: 'error',
        title: 'Houve um problema',
        description: getApiError(err, 'Não foi possível se conectar'),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full w-full items-center justify-center"
    >
      <Card variant="outlined" className="max-w-105">
        <Title level={2} className="mb-1!">
          Bem vindo
        </Title>
        <Text>
          Está pronto para
          <span className="text-primary font-semibold!"> transformar</span> seu
          ambiente?
        </Text>

        <div className="mt-4">
          <GoogleLoginButton />
        </div>

        <Divider className="my-4! font-normal! text-gray-600!">ou</Divider>

        <div className="flex flex-col gap-2">
          <TextInput
            required
            label="Email"
            name="email"
            autoComplete="username"
            control={control}
            disabled={isPending}
          />

          <TextInput
            required
            type="password"
            label="Senha"
            name="password"
            autoComplete="current-password"
            control={control}
            disabled={isPending}
          />
        </div>

        <div className="mt-1 flex items-center justify-end">
          <Link to={ROUTE_NAMES.FORGOT_PASSWORD}>
            <Button
              size="small"
              type="text"
              disabled={isPending}
              className="!px-[1px]! p-0! hover:underline"
            >
              esqueceu sua senha?
            </Button>
          </Link>
        </div>

        <Button
          htmlType="submit"
          type="primary"
          disabled={isPending}
          className="mt-4! h-11 w-full"
        >
          {isPending ? 'Entrando' : 'Entrar'}
        </Button>

        <div className="flex justify-center">
          <Link to={ROUTE_NAMES.SIGN_UP}>
            <Button
              size="small"
              type="text"
              disabled={isPending}
              className="mt-2 w-fit"
            >
              Criar conta
            </Button>
          </Link>
        </div>
      </Card>
    </form>
  );
};

export default SingIn;
