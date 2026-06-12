import dayjs from 'dayjs';

import { useNavigate } from 'react-router';

import { Button, Divider, Drawer, Tag, theme, Typography } from 'antd';
import {
  Activity,
  Calendar,
  ClipboardCheck,
  Clock,
  MessageCircle,
  Paperclip,
  PencilLine,
  X,
  type LucideIcon,
} from 'lucide-react';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import type { TConsult } from '@interfaces/Consult.interface';

import InitialsAvatar from '@components/InitialsAvatar';
import { formatTimerRange } from '@functions/formatTimerRange';

const { Text } = Typography;

type TField = {
  key: 'complaint' | 'evolution' | 'diagnosis' | 'prescription' | 'notes';
  label: string;
  icon: LucideIcon;
  empty: string;
  highlight?: boolean;
};

const FIELDS: TField[] = [
  {
    key: 'complaint',
    label: 'Motivo da consulta',
    icon: MessageCircle,
    empty: 'Sem motivo registrado',
  },
  {
    key: 'evolution',
    label: 'Evolução clínica',
    icon: Activity,
    empty: 'Sem evolução registrada',
  },
  {
    key: 'diagnosis',
    label: 'Diagnóstico',
    icon: ClipboardCheck,
    empty: 'Sem diagnóstico registrado',
    highlight: true,
  },
  {
    key: 'prescription',
    label: 'Prescrição',
    icon: Paperclip,
    empty: 'Sem prescrição registrada',
  },
  {
    key: 'notes',
    label: 'Observações',
    icon: PencilLine,
    empty: 'Sem observações registradas',
  },
];

type TConsultDetailDrawerProps = {
  consult: TConsult | null;
  open: boolean;
  onClose: () => void;
};

const ConsultDetailDrawer: React.FC<TConsultDetailDrawerProps> = (props) => {
  const { consult, open, onClose } = props;

  const {
    token: { colorPrimary, colorBorderSecondary, colorInfo, colorError },
  } = theme.useToken();

  const TYPE_META = {
    DEFAULT: { label: 'Consulta', color: colorPrimary },
    RETURN: { label: 'Retorno', color: colorInfo },
    URGENT: { label: 'Emergência', color: colorError },
  } as const;

  const navigate = useNavigate();

  const handleViewProfessional = () => {
    if (!consult) return;

    navigate(`${ROUTE_NAMES.CLINIC}/${consult.professional.id}`);
    onClose();
  };

  const startedAt = consult ? dayjs(consult.startedAt) : null;
  const finishedAt = consult?.finishedAt ? dayjs(consult.finishedAt) : null;

  return (
    <Drawer
      size={480}
      placement="right"
      open={open}
      onClose={onClose}
      closable={false}
      styles={{ body: { padding: 20 } }}
    >
      {consult && startedAt && (
        <div className="flex flex-col gap-4">
          <div
            style={{
              borderColor: colorBorderSecondary,
            }}
            className="flex items-center justify-between gap-3 border-b pb-4"
          >
            <div className="flex items-center gap-3">
              <Button
                icon={<X size={14} />}
                onClick={onClose}
                aria-label="Fechar"
              />

              <div className="flex flex-col">
                <Text
                  type="secondary"
                  className="text-xs! font-semibold tracking-wider"
                >
                  Resumo
                </Text>
                <Text className="text-base! font-bold">Blocos da consulta</Text>
              </div>
            </div>

            <Tag
              style={{
                color: TYPE_META[consult.appointment.type].color,
                background: TYPE_META[consult.appointment.type].color + '15',
                borderColor: TYPE_META[consult.appointment.type].color + '40',
              }}
              className="m-0! rounded-full!"
            >
              {TYPE_META[consult.appointment.type].label}
            </Tag>
          </div>

          <div
            style={{
              borderColor: colorBorderSecondary,
            }}
            className="flex items-center gap-3 rounded-xl border p-3"
          >
            <InitialsAvatar
              name={consult.professional.name}
              size={40}
              fontSize={15}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Text strong className="block w-full truncate">
                {consult.professional.name}
              </Text>

              <Text type="secondary" className="block w-full truncate text-xs!">
                Profissional responsável
              </Text>
            </div>
            <button
              type="button"
              onClick={handleViewProfessional}
              className="cursor-pointer text-sm font-medium whitespace-nowrap text-violet-600 hover:underline"
            >
              ver →
            </button>
          </div>

          <div
            style={{
              background: colorBorderSecondary,
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs"
          >
            <Text className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              {startedAt.format('DD/MM/YYYY')}
            </Text>
            <Divider orientation="vertical" className="mx-0!" />
            <Text className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-400" />
              {startedAt.format('HH:mm')}
              {finishedAt ? ` - ${finishedAt.format('HH:mm')}` : ''}
            </Text>
            {finishedAt && (
              <>
                <Divider orientation="vertical" className="mx-0!" />
                <Text>
                  {
                    formatTimerRange({
                      start: startedAt,
                      end: finishedAt,
                    }).duration
                  }
                </Text>
              </>
            )}
          </div>

          {FIELDS.map(({ key, label, icon: Icon, empty, highlight }) => {
            const value = consult[key];

            return (
              <div
                key={key}
                style={{
                  background: highlight ? colorPrimary + '10' : '',
                  borderColor: highlight ? colorPrimary : colorBorderSecondary,
                }}
                className="flex items-start gap-3 rounded-xl border p-3"
              >
                <div
                  style={{
                    color: highlight ? 'white' : colorPrimary,
                    background: highlight ? colorPrimary : colorPrimary + '15',
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                >
                  <Icon size={18} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <Text
                    type="secondary"
                    className="text-xs! font-bold tracking-wider"
                  >
                    {label}
                  </Text>
                  <Text
                    className={`wrap-break-words! whitespace-pre-wrap! ${
                      highlight ? 'text-base! font-semibold' : 'text-sm!'
                    } ${value ? '' : 'text-gray-400! italic'}`}
                  >
                    {value || empty}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
};

export default ConsultDetailDrawer;
