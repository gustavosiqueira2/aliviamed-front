import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { Checkbox, type CheckboxProps } from 'antd';

type TCheckboxInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: object;
  required?: boolean;
} & CheckboxProps;

const CheckboxInput = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  disabled,
  required,
  ...rest
}: TCheckboxInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              {...field}
              {...rest}
              checked={field.value}
              disabled={disabled}
            >
              {label}
              {required && <span className="ml-1 text-xl text-red-500">*</span>}
            </Checkbox>
          </label>
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

export default CheckboxInput;
