import {
  Controller,
  type FieldValues,
  type Control,
  type Path,
} from 'react-hook-form';
import { Input, type InputProps } from 'antd';

type TFormattedPhoneInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: object;
  containerClassName?: string;
} & Omit<InputProps, 'name' | 'value' | 'onChange'>;

const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

const PhoneInput = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  containerClassName,
  ...rest
}: TFormattedPhoneInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={containerClassName} style={{ width: '100%' }}>
          {label && (
            <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>
          )}
          <Input
            {...rest}
            value={formatPhoneNumber(value ?? '')}
            onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
            status={error ? 'error' : ''}
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

export default PhoneInput;
