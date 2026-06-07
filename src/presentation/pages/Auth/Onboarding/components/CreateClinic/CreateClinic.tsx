import { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router';

import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Card, Divider, theme, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { getApiError } from '@functions/getApiError';

import { useAuth, useCreateClinic, logout } from '@store/Auth.store';

import PublicLayout from '@components/Layout/PublicLayout';
import TextInput from '@components/Form/TextInput';

import { fetchCep } from '../../../../../../services/fetchCep';

import {
  createClinicSchema,
  type TCreateClinicForm,
} from './CreateClinicSchema';

const { Title, Text } = Typography;

type TCreateClinicProps = {
  onBack?: () => void;
};

const CreateClinic = ({ onBack }: TCreateClinicProps) => {
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { data } = useAuth();
  const { isPending, mutateAsync } = useCreateClinic();

  const defaultName = data?.user?.name ? `${data.user.name}'s Clinic` : '';

  const { control, handleSubmit, setValue } = useForm<TCreateClinicForm>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: { name: defaultName },
  });

  const cep = useWatch({ control, name: 'addressZip' });
  const lastFetchedCep = useRef('');

  useEffect(() => {
    const digits = (cep ?? '').replace(/\D/g, '');

    if (digits.length !== 8 || digits === lastFetchedCep.current) {
      return;
    }

    lastFetchedCep.current = digits;

    void fetchCep(digits).then((address) => {
      if (!address) {
        return;
      }
      setValue('addressStreet', address.logradouro, { shouldValidate: true });
      setValue('addressDistrict', address.bairro, { shouldValidate: true });
      setValue('addressCity', address.localidade, { shouldValidate: true });
      setValue('addressState', address.uf, { shouldValidate: true });
    });
  }, [cep, setValue]);

  const onSubmit: SubmitHandler<TCreateClinicForm> = async (form) => {
    try {
      await mutateAsync(form);

      notify({
        type: 'success',
        title: 'Clínica criada',
        description: 'Tudo pronto! Bem-vindo(a) ao Aliviamed.',
      });

      navigate(ROUTE_NAMES['/'], { replace: true });
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível criar a clínica',
        description: getApiError(err, 'Tente novamente em instantes'),
      });
    }
  };

  return (
    <PublicLayout>
      <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-fit w-full max-w-xl"
        >
          <Card variant="outlined" classNames={{ body: 'flex flex-col gap-4' }}>
            <div className="flex flex-col gap-1">
              <Title level={2} className="mb-0!">
                Crie sua <span style={{ color: colorPrimary }}>clínica</span>
              </Title>
              <Text type="secondary">
                Para começar a usar o Aliviamed, configure sua clínica abaixo.
              </Text>
            </div>

            <div className="flex flex-col gap-2">
              <TextInput
                label="Nome da clínica"
                control={control}
                name="name"
                disabled={isPending}
              />
              <TextInput
                label="Sua especialidade"
                control={control}
                name="specialty"
                placeholder="Ex.: Cardiologia"
                disabled={isPending}
              />
            </div>

            <Divider className="my-0!">Endereço</Divider>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 md:flex-row">
                <TextInput
                  label="CEP"
                  control={control}
                  name="addressZip"
                  placeholder="00000-000"
                  disabled={isPending}
                />
                <div className="md:w-2/3">
                  <TextInput
                    label="Logradouro"
                    control={control}
                    name="addressStreet"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row">
                <TextInput
                  label="Número"
                  control={control}
                  name="addressNumber"
                  disabled={isPending}
                />
                <TextInput
                  label="Complemento"
                  optional
                  control={control}
                  name="addressComplement"
                  disabled={isPending}
                />
              </div>

              <TextInput
                label="Bairro"
                control={control}
                name="addressDistrict"
                disabled={isPending}
              />

              <div className="flex flex-col gap-2 md:flex-row">
                <div className="md:w-2/3">
                  <TextInput
                    label="Cidade"
                    control={control}
                    name="addressCity"
                    disabled={isPending}
                  />
                </div>
                <TextInput
                  label="UF"
                  control={control}
                  name="addressState"
                  placeholder="SP"
                  disabled={isPending}
                />
              </div>
            </div>

            <Button
              htmlType="submit"
              type="primary"
              loading={isPending}
              className="h-11 w-full"
            >
              {isPending ? 'Criando' : 'Criar clínica'}
            </Button>
          </Card>

          <div className="mt-2 flex w-full justify-center">
            {onBack ? (
              <Button type="text" disabled={isPending} onClick={onBack}>
                Voltar
              </Button>
            ) : (
              <Button
                type="text"
                disabled={isPending}
                onClick={() => {
                  logout();
                  navigate(ROUTE_NAMES.SIGN_IN, { replace: true });
                }}
              >
                Sair
              </Button>
            )}
          </div>
        </form>
      </div>
    </PublicLayout>
  );
};

export default CreateClinic;
