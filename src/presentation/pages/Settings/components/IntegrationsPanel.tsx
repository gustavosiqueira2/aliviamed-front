import dayjs from 'dayjs';

import { Button, Popconfirm, Spin, Typography, theme } from 'antd';
import { CreditCard, MessageCircle } from 'lucide-react';

import {
  useConnectGoogleCalendar,
  useDisconnectGoogleCalendar,
  useGoogleCalendarStatus,
} from '@store/GoogleCalendar.store';

const { Title, Text } = Typography;

const GRID_ROWS = [96, 116, 136];
const GRID_COLS = [81, 107, 133, 159];
const ACTIVE_DAY = { x: 133, y: 116 };

const CalendarArt = () => (
  <svg
    viewBox="0 0 240 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Google Agenda"
    className="h-full w-full max-w-full"
  >
    <defs>
      <linearGradient
        id="calHeader"
        x1="60"
        y1="50"
        x2="180"
        y2="78"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
      <filter id="calShadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow
          dx="0"
          dy="6"
          stdDeviation="20"
          floodColor="#7c3aed"
          floodOpacity="0.20"
        />
      </filter>
      <filter id="badgeShadow" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow
          dx="0"
          dy="3"
          stdDeviation="5"
          floodColor="#7c3aed"
          floodOpacity="0.22"
        />
      </filter>
    </defs>

    {/* calendar body */}
    <g filter="url(#calShadow)">
      <rect x="60" y="50" width="120" height="104" rx="14" fill="#ffffff" />
    </g>

    {/* header */}
    <path
      d="M60 64a14 14 0 0 1 14-14h92a14 14 0 0 1 14 14v14H60z"
      fill="url(#calHeader)"
    />
    <rect
      x="74"
      y="61"
      width="46"
      height="6"
      rx="3"
      fill="#ffffff"
      opacity="0.85"
    />

    {/* binding rings */}
    <rect x="87" y="42" width="7" height="17" rx="3.5" fill="#c4b5fd" />
    <rect x="146" y="42" width="7" height="17" rx="3.5" fill="#c4b5fd" />

    {/* day grid */}
    {GRID_ROWS.map((cy) =>
      GRID_COLS.map((cx) => {
        const active = cx === ACTIVE_DAY.x && cy === ACTIVE_DAY.y;

        return (
          <rect
            key={`${cx}-${cy}`}
            x={cx - 7}
            y={cy - 7}
            width="14"
            height="14"
            rx="4"
            fill={active ? '#7c3aed' : '#ede9fe'}
          />
        );
      }),
    )}
    <path
      d="m129 116 3 3 5.5-6.5"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* floating check badge */}
    <circle cx="156" cy="36" r="3" fill="#c4b5fd" />
    <circle cx="164" cy="29" r="2.2" fill="#a78bfa" />
    <g filter="url(#badgeShadow)">
      <circle cx="176" cy="46" r="13" fill="#ffffff" />
    </g>
    <path
      d="m171 46 3.5 3.5 6.5-7.5"
      stroke="#8b5cf6"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type TComingSoon = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tint: string;
  color: string;
};

const COMING_SOON: TComingSoon[] = [
  {
    key: 'whatsapp',
    title: 'WhatsApp',
    subtitle: 'Lembretes automáticos de consulta.',
    icon: <MessageCircle size={18} />,
    tint: '#dcfce7',
    color: '#16a34a',
  },
  {
    key: 'pagamentos',
    title: 'Pagamentos',
    subtitle: 'Cobrança de consultas e recibos, tudo dentro do app!',
    icon: <CreditCard size={18} />,
    tint: '#dbeafe',
    color: '#2563eb',
  },
];

const IntegrationsPanel = () => {
  const { token } = theme.useToken();

  const { data: status, isLoading } = useGoogleCalendarStatus();
  const { mutate: connect, isPending: connecting } = useConnectGoogleCalendar();
  const { mutate: disconnect, isPending: disconnecting } =
    useDisconnectGoogleCalendar();

  const connected = status?.connected;

  return (
    <div className="max-w-3xl">
      <Title level={4} className="mt-0!">
        Integrações
      </Title>

      <div className="mt-4 flex flex-col gap-4">
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: token.colorBorderSecondary }}
        >
          <div className="flex flex-col sm:flex-row">
            <div className="flex-1 p-6">
              <div className="text-xs font-semibold tracking-[0.14em] text-gray-400 uppercase">
                Calendário
              </div>

              <Title level={4} className="mt-2! mb-1!">
                Conecte sua Google Agenda
              </Title>

              <Text type="secondary" className="block max-w-sm">
                Novos agendamentos da clínica aparecem automaticamente na sua
                Agenda, com lembrete e link de videochamada.
              </Text>

              <div className="mt-5 flex min-h-8 items-center gap-3">
                {isLoading ? (
                  <Spin size="small" />
                ) : connected ? (
                  <>
                    <Popconfirm
                      title="Desconectar a Google Agenda?"
                      okText="Desconectar"
                      cancelText="Cancelar"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => disconnect()}
                    >
                      <Button danger loading={disconnecting}>
                        Desconectar
                      </Button>
                    </Popconfirm>

                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                      <Text type="secondary" className="truncate text-xs!">
                        {status?.googleEmail ?? 'Conectada'}
                        {status?.connectedAt &&
                          ` · desde ${dayjs(status.connectedAt).format('DD/MM/YYYY')}`}
                      </Text>
                    </span>
                  </>
                ) : (
                  <>
                    <Button
                      type="primary"
                      loading={connecting}
                      onClick={() => connect()}
                    >
                      Conectar
                    </Button>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gray-300" />
                      <Text type="secondary" className="text-xs!">
                        Não conectada
                      </Text>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center bg-linear-to-br from-violet-50 to-violet-100 sm:w-72 dark:from-violet-500/10 dark:to-violet-500/5">
              <CalendarArt />
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: token.colorBorderSecondary }}
        >
          {COMING_SOON.map((item, index) => (
            <div
              key={item.key}
              className="flex items-center gap-3 p-4"
              style={
                index > 0
                  ? {
                      borderTop: `1px solid ${token.colorBorderSecondary}`,
                    }
                  : undefined
              }
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: item.tint, color: item.color }}
              >
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <Text strong className="block">
                  {item.title}
                </Text>
                <Text type="secondary" className="text-xs!">
                  {item.subtitle}
                </Text>
              </div>

              <span
                className="rounded-full border border-dashed px-3 py-1 text-xs text-gray-400"
                style={{ borderColor: token.colorBorder }}
              >
                Em breve
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPanel;
