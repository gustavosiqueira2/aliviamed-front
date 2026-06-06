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
};

const PatientSelect = <T extends FieldValues>({
  control,
  name,
}: TPatientSelectProps<T>) => {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useSearchPatients(debouncedSearch);

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
            value={value}
            loading={isLoading}
            placeholder="Buscar paciente"
            notFoundContent={
              isLoading ? 'Buscando...' : 'Nenhum paciente encontrado'
            }
            onChange={onChange}
            options={data?.map((patient) => ({
              label: patient.name,
              value: patient.id,
            }))}
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
