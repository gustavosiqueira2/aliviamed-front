import {
  Controller,
  type FieldValues,
  type Control,
  type Path,
} from 'react-hook-form';

import type { TextAreaProps } from 'antd/es/input';
import { Input } from 'antd';

const { TextArea } = Input;

type TTextInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: object;
  optional?: boolean;
  required?: boolean;
} & TextAreaProps;

const TextAreaInput = <T extends FieldValues>(props: TTextInputProps<T>) => {
  const {
    name,
    control,
    label,
    rules = {},
    disabled,
    required,
    optional = false,
    ...rest
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
          <TextArea
            {...field}
            {...rest}
            disabled={disabled}
            status={error ? 'error' : ''}
          />
          {error && (
            <div style={{ color: '#ff4d4f', fontSize: 12 }}>
              {error.message}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default TextAreaInput;
