import { useEffect } from 'react';

import dayjs from 'dayjs';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNavigate, useParams } from 'react-router';

import { Breadcrumb, Button, Card, Divider, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { useNotificationContext } from '@contexts/NotificationContext';

import { usePatient, useUpdatePatient } from '@store/PatientStore';

import TextInput from '@components/Form/TextInput';
import DateInput from '@components/Form/DateInput';
import SelectInput from '@components/Form/SelectInput';
import PhoneInput from '@components/Form/PhoneInput';

import {
  UpdatePatientSchema,
  type TUpdatePatientForm,
} from './UpdatePatientSchema';

const { Title } = Typography;

const UpdatePatient = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const { notify } = useNotificationContext();

  const { mutateAsync, isPending } = useUpdatePatient();
  const { data: patient } = usePatient(patientId!);

  const { control, handleSubmit, reset } = useForm<TUpdatePatientForm>({
    resolver: zodResolver(UpdatePatientSchema),
  });

  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name,
        birthdate: patient.birthdate,
        phone: patient.phone ?? '',
        document: patient.document ?? '',
        sex: patient.sex as TUpdatePatientForm['sex'],
        email: patient.email ?? '',
      });
    }
  }, [patient, reset]);

  if (!patient) return;

  const onSubmit: SubmitHandler<TUpdatePatientForm> = async (data) => {
    if (!patientId) return;

    try {
      await mutateAsync({
        id: patientId,
        name: data.name,
        birthdate: dayjs(data.birthdate).format('YYYY-MM-DD'),
        phone: data.phone || null,
        document: data.document || null,
        sex: data.sex || null,
        email: data.email || null,
      });

      notify({
        type: 'success',
        title: 'Sucesso',
        description: `A Ficha do paciente foi atualizada!`,
      });
      navigate(`${ROUTE_NAMES.PATIENTS}/${patientId}`);
    } catch (err) {
      console.error(err);

      notify({
        type: 'error',
        title: 'Houve um problema',
        description:
          'Não foi possível atualizar a ficha do paciente, tente novamente!',
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
          { title: 'Detalhes' },
        ]}
      />

      <Title level={2}>Atualizar Ficha do Paciente</Title>
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

          <Title level={4} className="mt-4! mb-1!">
            Dados adicionais
          </Title>
          <Divider className="mt-0! mb-2!" />
          <div className="flex gap-4">
            <PhoneInput
              control={control}
              name="phone"
              label="Telefone"
              optional
              disabled={isPending}
            />
            <TextInput
              control={control}
              name="document"
              label="CPF"
              optional
              maxLength={14}
              disabled={isPending}
            />
          </div>
          <div className="mt-2 flex gap-4">
            <SelectInput
              control={control}
              name="sex"
              label="Sexo"
              optional
              allowClear
              options={[
                { label: 'Masculino', value: 'MALE' },
                { label: 'Feminino', value: 'FEMALE' },
                { label: 'Outro', value: 'OTHER' },
              ]}
              disabled={isPending}
            />
            <TextInput
              control={control}
              name="email"
              label="E-mail"
              type="email"
              optional
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
              Salvar alterações
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default UpdatePatient;
