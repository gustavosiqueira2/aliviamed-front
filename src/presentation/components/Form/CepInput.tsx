import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
  type PathValue,
} from 'react-hook-form';

import { fetchCep, type TCep } from '@api/fetchCep';

import TextInput from './TextInput';

const formatCep = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 5) return cleaned.slice(0, 5);
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
};

type CepInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  onCepLoaded?: (data: TCep | null) => void;
};

const CepInput = <T extends FieldValues>({
  name,
  control,
  setValue,
  onCepLoaded,
}: CepInputProps<T>) => {
  const handleCepChange =
    (onChange: (...event: React.ChangeEvent<HTMLInputElement>[]) => void) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const cep = e.target.value.replace(/\D/g, '');

      if (cep.length <= 8) {
        onChange({
          ...e,
          target: { ...e.target, value: formatCep(e.target.value) },
        });

        if (cep.length === 8) {
          const address = await fetchCep(cep);

          if (address) {
            setValue(
              'address.street' as Path<T>,
              address.logradouro as PathValue<T, Path<T>>,
            );
            setValue(
              'address.neighborhood' as Path<T>,
              address.bairro as PathValue<T, Path<T>>,
            );
            setValue(
              'address.city' as Path<T>,
              address.localidade as PathValue<T, Path<T>>,
            );
            setValue(
              'address.state' as Path<T>,
              address.uf as PathValue<T, Path<T>>,
            );
            setValue('address.number' as Path<T>, '' as PathValue<T, Path<T>>);

            onCepLoaded?.(address);
          }
        }
      }
    };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { onChange, value, ...restField } = field;

        return (
          <TextInput
            {...restField}
            onChange={handleCepChange(onChange)}
            control={control}
            name={name}
            label="CEP"
            value={value ?? ''}
            className="w-full sm:max-w-30"
          />
        );
      }}
    />
  );
};

export default CepInput;
