import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { Input, type InputProps } from 'antd';

type TMoneyInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: object;
  optional?: boolean;
  containerClassName?: string;
} & Omit<InputProps, 'name' | 'value' | 'onChange' | 'prefix'>;

const formatMoney = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '';

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const parseMoney = (text: string): number | null => {
  const digits = text.replace(/\D/g, '');
  if (digits === '') return null;

  return Number(digits) / 100;
};

const MoneyInput = <T extends FieldValues>(props: TMoneyInputProps<T>) => {
  const {
    name,
    control,
    label,
    rules = {},
    optional = false,
    containerClassName,
    disabled,
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
          <Input
            {...rest}
            inputMode="numeric"
            prefix="R$"
            disabled={disabled}
            value={formatMoney(value)}
            onChange={(e) => onChange(parseMoney(e.target.value))}
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

export default MoneyInput;
