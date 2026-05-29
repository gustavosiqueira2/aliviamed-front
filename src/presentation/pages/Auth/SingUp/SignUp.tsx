import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Card, theme, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import PhoneInput from '@components/Form/PhoneInput';
import DateInput from '@components/Form/DateInput';
import TextInput from '@components/Form/TextInput';

import { signUpSchema, type TSignUpForm } from './SignUpSchema';

const SignUp = () => {
  const { notify } = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { control, handleSubmit } = useForm<TSignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (form: TSignUpForm) => {
    try {
      setLoading(true);

      const body = {
        phone: form.phone,
        email: form.email,
        password: form.password,
        user: {
          name: form.name,
          age: form.birthdate,
        },
      };

      console.log('🚀 > onSubmit > body:', body);

      notify({
        type: 'success',
        title: 'Sucesso',
        description: 'Seu cadastro no Aliviamed foi realizado!',
      });

      navigate(`${ROUTE_NAMES['/']}/${location.search}`, {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      notify({
        type: 'error',
        title: 'Houve algo inesperado',
        description:
          'Não conseguimos cadastrar usuário. Verifique os dados e tente novamente.',
      });
    } finally {
      setLoading(false);
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
