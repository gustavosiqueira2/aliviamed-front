import { useState } from 'react';

import { Select } from 'antd';

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { useDebounce } from '@hooks/useDebounce';

import { useSearchProfessional } from '@store/Clinic.store';
import type { TClinicSearchProfessional } from '@interfaces/Clinic.interface';

type TProfessionalSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  onSelected?: (professional: TClinicSearchProfessional | null) => void;
};

const ProfessionalSelect = <T extends FieldValues>({
  control,
  name,
  onSelected,
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
            onChange={(selected) => {
              onChange(selected);
              onSelected?.(
                data?.find((professional) => professional.id === selected) ??
                  null,
              );
            }}
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
