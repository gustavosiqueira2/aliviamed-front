import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import { Button, Modal, Typography } from 'antd';

import { USER_ROLES } from '@constants/USER_ROLES';

import { getApiError } from '@functions/getApiError';

import { useNotificationContext } from '@contexts/NotificationContext';

import { useAuth } from '@store/Auth.store';
import { useFormOptions, useSendForm } from '@store/Form.store';

import type { TForm } from '@interfaces/Form.interface';

import SelectInput from '@components/Form/SelectInput';
import PatientSelect from '@components/PatientSelect';
import ProfessionalSelect from '@components/ProfessionalSelect';

import { SendFormSchema, type SendFormForm } from './SendFormSchema';

const { Title, Text } = Typography;

type TSendFormModalProps = {
  open: boolean;
  onCancel: () => void;
  initialForm?: TForm;
  initialPatient?: { id: string; name: string };
};

const SendFormModal: React.FC<TSendFormModalProps> = ({
  open,
  onCancel,
  initialForm,
  initialPatient,
}) => {
  const { data: auth } = useAuth();

  const { notify } = useNotificationContext();

  const { data: forms = [] } = useFormOptions();
  const { isPending, mutateAsync: sendForm } = useSendForm();

  const isProfessional = auth?.clinicProfile?.role === USER_ROLES.PROFESSIONAL;
  const myId = auth?.user.id;
  const myName = auth?.user.name;

  const lockProfessional = !initialForm && isProfessional;
  const lockPatient = !!initialPatient;

  const { control, handleSubmit, reset, setValue, formState } =
    useForm<SendFormForm>({
      resolver: zodResolver(SendFormSchema),
      mode: 'onChange',
    });

  const professionalId = useWatch({ control, name: 'professionalId' });

  useEffect(() => {
    if (!open) return;

    const patientId = initialPatient?.id ?? '';

    if (initialForm) {
      reset({
        professionalId: initialForm.professionalId ?? '',
        patientId,
        formId: initialForm.id,
      });

      return;
    }

    reset(
      isProfessional && myId
        ? { professionalId: myId, patientId, formId: '' }
        : { professionalId: '', patientId, formId: '' },
    );
  }, [open, initialForm, initialPatient, isProfessional, myId, reset]);

  const professionalFixedOption =
    initialForm && initialForm.professionalId
      ? {
          id: initialForm.professionalId,
          name: initialForm.professionalName ?? '',
        }
      : lockProfessional && myId && myName
        ? { id: myId, name: myName }
        : undefined;

  const formOptions = forms
    .filter((form) => form.professionalId === professionalId)
    .map((form) => ({ label: form.name, value: form.id }));

  const onSubmit: SubmitHandler<SendFormForm> = async (data) => {
    try {
      await sendForm({ formId: data.formId, patientId: data.patientId });

      notify({
        type: 'success',
        title: 'Formulário enviado',
        description: 'O paciente receberá o link por e-mail.',
      });

      onCancel();
    } catch (err) {
      notify({
        type: 'error',
        title: 'Não foi possível enviar',
        description: getApiError(err, 'Não foi possível enviar o formulário'),
      });
    }
  };

  return (
    <Modal
      footer={null}
      title={null}
      open={open}
      onCancel={() => !isPending && onCancel()}
      width={460}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Title level={4} className="my-0!">
          Enviar formulário
        </Title>

        <div className="flex flex-col">
          <Text>Profissional</Text>
          <ProfessionalSelect
            control={control}
            name="professionalId"
            disabled={lockProfessional || isPending}
            fixedOption={professionalFixedOption}
            onSelected={() => setValue('formId', '')}
          />
        </div>

        <div className="flex flex-col">
          <Text>Paciente</Text>
          <PatientSelect
            control={control}
            name="patientId"
            disabled={lockPatient || isPending}
            fixedOption={initialPatient}
          />
        </div>

        <div className="flex flex-col">
          <Text>Formulário</Text>
          <SelectInput
            control={control}
            name="formId"
            placeholder={
              professionalId
                ? 'Selecione o formulário'
                : 'Selecione um profissional primeiro'
            }
            disabled={isPending || !professionalId}
            options={formOptions}
            notFoundContent="Nenhum formulário deste profissional"
          />
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            disabled={isPending || !formState.isValid}
          >
            Enviar por e-mail
          </Button>
          <Button type="text" disabled={isPending} onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SendFormModal;
