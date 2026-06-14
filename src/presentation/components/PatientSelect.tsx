import { useState } from 'react';

import { Select } from 'antd';

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { useDebounce } from '@hooks/useDebounce';

import { useSearchPatients } from '@store/Patient.store';

type TPatientSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  onSelected?: (patient: { id: string; name: string } | null) => void;
  disabled?: boolean;
  fixedOption?: { id: string; name: string };
};

const PatientSelect = <T extends FieldValues>({
  control,
  name,
  onSelected,
  disabled,
  fixedOption,
}: TPatientSelectProps<T>) => {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useSearchPatients(debouncedSearch);

  const options = (
    data?.map((patient) => ({
      label: patient.name,
      value: patient.id,
    })) ?? []
  ).concat(
    fixedOption && !data?.some((patient) => patient.id === fixedOption.id)
      ? [{ label: fixedOption.name, value: fixedOption.id }]
      : [],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <Select
            showSearch={{
              filterOption: false,
              optionFilterProp: 'label',
              onSearch: setSearch,
            }}
            allowClear
            disabled={disabled}
            value={value}
            loading={isLoading}
            placeholder="Buscar paciente"
            notFoundContent={
              isLoading ? 'Buscando...' : 'Nenhum paciente encontrado'
            }
            onChange={(selected) => {
              onChange(selected);
              const patient = data?.find((item) => item.id === selected);
              onSelected?.(
                patient ? { id: patient.id, name: patient.name } : null,
              );
            }}
            options={options}
          />
          {error && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 12 }}>
              {error.message}
            </div>
          )}
        </>
      )}
    />
  );
};

export default PatientSelect;
