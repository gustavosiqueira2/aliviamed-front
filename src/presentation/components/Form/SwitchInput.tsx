import {
  Controller,
  type FieldValues,
  type Control,
  type Path,
} from 'react-hook-form';

import { Switch } from 'antd';

type TSwitchInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: object;
  optional?: boolean;
  required?: boolean;
  disabled?: boolean;
};

const SwitchInput = <T extends FieldValues>(props: TSwitchInputProps<T>) => {
  const {
    name,
    control,
    label,
    rules = {},
    disabled,
    required,
    optional = false,
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div style={{ width: '100%' }}>
          {label && (
            <label style={{ display: 'block', marginBottom: 4 }}>
              {label}{' '}
              {required && (
                <span className="absolute ml-1 text-xl text-red-500">*</span>
              )}
              {optional && <span className="text-gray-400">(opcional)</span>}
            </label>
          )}

          <Switch
            checked={field.value}
            onChange={(checked) => {
              field.onChange(checked);
              field.onBlur();
            }}
            disabled={disabled}
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

export default SwitchInput;
