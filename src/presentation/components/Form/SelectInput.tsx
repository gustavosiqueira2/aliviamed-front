import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { Select, type SelectProps } from 'antd';

type TSelectOption = {
  label: string;
  value: string | number;
};

type TSelectInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: TSelectOption[];
  rules?: object;
  optional?: boolean;
  containerClassName?: string;
} & Omit<SelectProps, 'name' | 'options' | 'value' | 'onChange'>;

const SelectInput = <T extends FieldValues>(props: TSelectInputProps<T>) => {
  const {
    name,
    control,
    label,
    options,
    rules = {},
    disabled,
    optional = false,
    containerClassName,
    ...rest
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={containerClassName} style={{ width: '100%' }}>
          {label && (
            <label style={{ display: 'block', marginBottom: 4 }}>
              {label}{' '}
              {optional && <span className="text-gray-400">(opcional)</span>}
            </label>
          )}
          <Select
            {...rest}
            value={value ?? undefined}
            onChange={onChange}
            options={options}
            disabled={disabled}
            status={error ? 'error' : ''}
            style={{ width: '100%' }}
          />
          {error && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 12 }}>
              {error.message}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default SelectInput;
