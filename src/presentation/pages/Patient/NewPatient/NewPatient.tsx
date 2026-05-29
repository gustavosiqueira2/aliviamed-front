import { useNavigate } from 'react-router';

import dayjs from 'dayjs';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Breadcrumb, Button, Card, Divider, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useCreatePatient } from '@store/PatientStore';

import TextInput from '@components/Form/TextInput';
import DateInput from '@components/Form/DateInput';

import { NewPatientSchema, type TNewPatientForm } from './NewPatientSchema';

const { Title } = Typography;

const NewPatient = () => {
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const { mutateAsync: createPatient, isPending } = useCreatePatient();

  const { control, handleSubmit } = useForm<TNewPatientForm>({
    resolver: zodResolver(NewPatientSchema),
  });

  const onSubmit: SubmitHandler<TNewPatientForm> = async (data) => {
    try {
      const payload = {
        ...data,
        birthdate: dayjs(data.birthdate).format('YYYY-MM-DD'),
      };

      await createPatient(payload);

      notify({
        type: 'success',
        title: 'Sucesso',
        description: `O Paciente ${data.name} foi cadastrado!`,
      });
      navigate(ROUTE_NAMES.PATIENTS);
    } catch (err) {
      console.error(err);

      notify({
        type: 'error',
        title: 'Houve um problema',
        description: 'Não foi possível cadastrar o paciente, tente novamente!',
      });
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Pacientes',
            className: 'cursor-pointer',
            onClick: () => navigate(ROUTE_NAMES.PATIENTS),
          },
          { title: 'Novo' },
        ]}
      />

      <Title level={2}>Cadastrar novo Paciente</Title>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Title level={4} className="mb-1!">
            Dados básicos <span className="text-red-500">*</span>
          </Title>
          <Divider className="mt-0! mb-2!" />
          <div className="flex gap-4">
            <TextInput
              control={control}
              name="name"
              label="Nome"
              disabled={isPending}
            />
            <DateInput
              control={control}
              name="birthdate"
              label="Data de nascimento"
              type="number"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end">
            <Button
              disabled={isPending}
              htmlType="submit"
              type="primary"
              className="mt-4"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default NewPatient;
