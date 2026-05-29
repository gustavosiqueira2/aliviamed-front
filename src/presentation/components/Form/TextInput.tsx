import { useState } from 'react';

import {
  Controller,
  type FieldValues,
  type Control,
  type Path,
} from 'react-hook-form';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, type InputProps } from 'antd';

type TTextInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: object;
  optional?: boolean;
  required?: boolean;
} & InputProps;

const TextInput = <T extends FieldValues>(props: TTextInputProps<T>) => {
  const {
    name,
    control,
    label,
    rules = {},
    type,
    disabled,
    required,
    optional = false,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const handleTogglePassword = () => {
    if (!disabled) {
      setShowPassword((prev) => !prev);
    }
  };

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
          <Input
            {...field}
            {...rest}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            disabled={disabled}
            status={error ? 'error' : ''}
            suffix={
              isPassword &&
              (showPassword ? (
                <EyeTwoTone
                  onClick={handleTogglePassword}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <EyeInvisibleOutlined
                  onClick={handleTogglePassword}
                  style={{ cursor: 'pointer' }}
                />
              ))
            }
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

export default TextInput;
