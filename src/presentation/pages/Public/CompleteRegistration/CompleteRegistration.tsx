import { useNavigate, useSearchParams } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Card, theme, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useCompleteRegistration } from '@store/Auth.store';

import LoginLayout from '@components/Layout/LoginLayout';
import TextInput from '@components/Form/TextInput';

import {
  completeRegistrationSchema,
  type TCompleteRegistrationForm,
} from './CompleteRegistrationSchema';

const { Title, Text } = Typography;

const CompleteRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const token = searchParams.get('token') ?? '';
  const clinicName = searchParams.get('clinic') ?? '';

  const { isPending, mutateAsync } = useCompleteRegistration();

  const { control, handleSubmit } = useForm<TCompleteRegistrationForm>({
    resolver: zodResolver(completeRegistrationSchema),
  });

  const onSubmit: SubmitHandler<TCompleteRegistrationForm> = async (form) => {
    try {
      await mutateAsync({ token, password: form.password });

      notify({
        type: 'success',
        title: 'Cadastro concluído',
        description: 'Seja bem-vindo(a) ao Aliviamed!',
      });

      navigate(ROUTE_NAMES['/'], { replace: true });
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível concluir',
        description: getApiError(err, 'Convite inválido ou expirado'),
      });
    }
  };

  if (!token) {
    return (
      <LoginLayout>
        <div className="flex h-full items-center justify-center">
          <Card variant="outlined" className="max-w-105">
            <Title level={3} className="mb-1!">
              Convite inválido
            </Title>
            <Text>
              Este link de convite está incompleto. Solicite um novo convite ao
              administrador da clínica.
            </Text>
          </Card>
        </div>
      </LoginLayout>
    );
  }

  return (
    <LoginLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full items-center justify-center"
      >
        <Card
          variant="outlined"
          className="max-w-105"
          classNames={{ body: 'flex flex-col' }}
        >
          <div className="flex flex-col gap-1">
            <Title level={2} className="mb-2!">
              Bem vindo ao{' '}
              <span style={{ color: colorPrimary }}>Aliviamed</span>
            </Title>

            <Text>
              {clinicName ? (
                <>
                  Você foi convidado(a) para entrar em{' '}
                  <strong>{clinicName}</strong>. Defina sua senha para concluir
                  seu cadastro.
                </>
              ) : (
                'Defina sua senha para acessar a clínica que te convidou.'
              )}
            </Text>
          </div>

          <div className="mt-2 mb-4 flex flex-col gap-2">
            <TextInput
              label="Senha"
              type="password"
              name="password"
              autoComplete="new-password"
              control={control}
              disabled={isPending}
            />
            <TextInput
              label="Confirmar sua senha"
              type="password"
              name="confirmPassword"
              autoComplete="off"
              control={control}
              disabled={isPending}
            />
          </div>

          <Button
            aria-label="Concluir cadastro"
            type="primary"
            htmlType="submit"
            loading={isPending}
          >
            {isPending ? 'Concluindo' : 'Concluir cadastro'}
          </Button>
        </Card>
      </form>
    </LoginLayout>
  );
};

export default CompleteRegistration;
