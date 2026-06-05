import { DatePicker, Input, InputNumber, Select } from 'antd';

import type { TInput } from '../NewForm';

export const renderFormInput = (input: TInput, placeholder?: string) => {
  const ph = placeholder ?? input.label;

  switch (input.type) {
    case 'number':
      return <InputNumber className="w-full!" placeholder={ph} />;
    case 'email':
      return <Input type="email" placeholder={ph} />;
    case 'phone':
      return <Input inputMode="tel" placeholder={ph} />;
    case 'date':
      return (
        <DatePicker className="w-full!" format="DD/MM/YYYY" placeholder={ph} />
      );
    case 'select':
      return (
        <Select
          className="w-full!"
          placeholder={ph}
          options={(input.options ?? []).map((option) => ({
            label: option,
            value: option,
          }))}
        />
      );
    case 'textarea':
      return <Input.TextArea rows={3} placeholder={ph} />;
    default:
      return <Input placeholder={ph} />;
  }
};
