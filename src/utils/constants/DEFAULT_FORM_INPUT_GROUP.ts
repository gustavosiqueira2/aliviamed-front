import { MessageSquareText, Phone, UserRound } from 'lucide-react';

import type { TInputGroup } from '@pages/Forms/NewForm/NewForm';

export const DEFAULT_FORM_INPUT_GROUP: TInputGroup[] = [
  {
    id: '111',
    show: false,
    title: 'Dados básicos',
    description: 'Nome, Idade.',
    Icon: UserRound,
    iconColor: 'blue',
    inputs: [
      {
        type: 'text',
        name: 'name',
        label: 'Nome',
      },
      {
        type: 'number',
        name: 'age',
        label: 'Idade',
      },
    ],
  },
  {
    id: '222',
    show: false,
    title: 'Contato e Endereço',
    description: 'Numero de contato (whatsapp), Emails.',
    Icon: Phone,
    iconColor: 'purple',
    inputs: [
      {
        type: 'phone',
        name: 'phone',
        label: 'Telefone (Whatsapp)',
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email',
      },
    ],
  },
  {
    id: '333',
    show: false,
    title: 'Resumo',
    description: 'Resumo',
    Icon: MessageSquareText,
    iconColor: 'orange',
    inputs: [
      {
        type: 'text',
        name: 'resume',
        label: 'Resumo',
      },
    ],
  },
];
