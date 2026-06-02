import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Card, theme, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useAuthUser, useRegister } from '@store/AuthStore';

import PhoneInput from '@components/Form/PhoneInput';
import DateInput from '@components/Form/DateInput';
import TextInput from '@components/Form/TextInput';

import { getApiError } from '@functions/getApiError';

import { signUpSchema, type TSignUpForm } from './SignUpSchema';

const SignUp = () => {
  const { notify } = useNotificationContext();
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<TSignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { mutateAsync: registerUser, isPending: registering } = useRegister();
  const { mutateAsync: authUser, isPending: authenticating } = useAuthUser();

  const loading = registering || authenticating;

  const onSubmit = async (form: TSignUpForm) => {
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        birthdate: form.birthdate,
      });
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível cadastrar',
        description: getApiError(err, 'Verifique os dados e tente novamente.'),
      });
      return;
    }

    try {
      await authUser({ email: form.email, password: form.password });

      notify({
        type: 'success',
        title: 'Sucesso',
        description: 'Seu cadastro no Aliviamed foi realizado!',
      });

      navigate(ROUTE_NAMES['/'], { replace: true });
    } catch {
      notify({
        type: 'info',
        title: 'Conta criada',
        description: 'Faça login para entrar na aplicação.',
      });

      navigate(ROUTE_NAMES.SIGN_IN, { replace: true });
    }
  };

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
        <div className="flex flex-col items-center gap-1">
          <Typography.Title level={2} className="mb-2!">
            Aliviamed
          </Typography.Title>

          <Typography.Title
            level={4}
            className="mt-0! mb-0!"
            style={{ color: colorPrimary }}
          >
            Cadastrar-se
          </Typography.Title>
          <Typography.Text>
            Bem-vindo ao Aliviamed, cadastre-se para continuar
          </Typography.Text>
        </div>

        <div className="mt-2 mb-4 flex flex-col gap-2">
          <TextInput
            label="Nome"
            name="name"
            control={control}
            disabled={loading}
          />
          <PhoneInput
            label="Telefone"
            name="phone"
            control={control}
            disabled={loading}
          />
          <TextInput
            label="Email"
            name="email"
            control={control}
            disabled={loading}
          />

          <DateInput
            label="Data de nascimento"
            name="birthdate"
            control={control}
            disabled={loading}
          />

          <TextInput
            label="Senha"
            type="password"
            name="password"
            autoComplete="new-password"
            control={control}
            disabled={loading}
          />
          <TextInput
            label="Confirmar sua senha"
            type="password"
            name="confirmPassword"
            autoComplete="off"
            control={control}
            disabled={loading}
          />
        </div>

        <Button
          aria-label="Criar conta"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Criar conta
        </Button>
      </Card>
    </form>
  );
};

export default SignUp;
