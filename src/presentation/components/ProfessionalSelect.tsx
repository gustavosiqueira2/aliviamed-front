import { useState } from 'react';

import { Select } from 'antd';

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { useDebounce } from '@hooks/useDebounce';

import { useSearchProfessional } from '@store/ClinicStore';

type TProfessionalSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

const ProfessionalSelect = <T extends FieldValues>({
  control,
  name,
}: TProfessionalSelectProps<T>) => {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useSearchProfessional(debouncedSearch);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <Select
            allowClear
            showSearch={{
              filterOption: false,
              optionFilterProp: 'label',
              onSearch: setSearch,
            }}
            value={value}
            onChange={onChange}
            loading={isLoading}
            placeholder="Buscar profissional"
            notFoundContent={
              isLoading
                ? 'Buscando...'
                : !value
                  ? 'Digite para pesquisar'
                  : 'Nenhum profissional encontrado'
            }
            options={data?.map((professional) => ({
              label: professional.name,
              value: professional.id,
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

export default ProfessionalSelect;
