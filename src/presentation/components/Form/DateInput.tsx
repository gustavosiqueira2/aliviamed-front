import {
  Controller,
  type FieldValues,
  type Control,
  type Path,
} from 'react-hook-form';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { DatePicker, type DatePickerProps } from 'antd';

import { getDateInputLocaleAndFormat } from '@functions/getDateInputLocaleAndFormat';

dayjs.extend(customParseFormat);

type TDateInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: object;
} & Omit<DatePickerProps, 'name' | 'value' | 'onChange'>;

const DateInput = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  ...rest
}: TDateInputProps<T>) => {
  const { format, locale } = getDateInputLocaleAndFormat();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div style={{ width: '100%' }}>
          {label && (
            <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>
          )}
          <DatePicker
            {...rest}
            locale={locale}
            format={format}
            value={value ? dayjs(value) : null}
            onChange={(date) =>
              onChange(!Array.isArray(date) && date ? date.toDate() : null)
            }
            status={error ? 'error' : ''}
            style={{ width: '100%' }}
            disabled={rest.disabled}
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

export default DateInput;
