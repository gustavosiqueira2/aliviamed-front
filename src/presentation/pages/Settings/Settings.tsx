import { useState } from 'react';

import { useNavigate } from 'react-router';

import { Card, Descriptions, Menu, Modal, Tag, Typography } from 'antd';
import { Check, Info, LogOut, Monitor, Moon, Palette, Sun } from 'lucide-react';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { ROLE_COLORS } from '@constants/ROLE_COLORS';

import { translateRole } from '@functions/translateRole';

import { logout, useAuth } from '@store/AuthStore';
import { useTheme, type TThemeMode } from '@contexts/ThemeContext';

import FadeWrapper from '@components/FadeWrapper';

const { Title, Text } = Typography;

type TSettingsSection = 'info' | 'appearance';

const PALETTES = {
  light: { bg: '#ffffff', side: '#f0f0f0', line: '#e5e7eb', accent: '#8b5cf6' },
  dark: { bg: '#1f1f1f', side: '#141414', line: '#434343', accent: '#8b5cf6' },
};

const PreviewWindow: React.FC<{ palette: typeof PALETTES.light }> = ({
  palette,
}) => (
  <div className="flex h-full w-full" style={{ background: palette.bg }}>
    <div
      className="flex w-1/4 flex-col gap-1 p-1.5"
      style={{ background: palette.side }}
    >
      <div className="h-1.5 rounded" style={{ background: palette.accent }} />
      <div className="h-1.5 rounded" style={{ background: palette.line }} />
      <div className="h-1.5 rounded" style={{ background: palette.line }} />
    </div>
    <div className="flex flex-1 flex-col gap-1 p-1.5">
      <div className="h-2 w-2/3 rounded" style={{ background: palette.line }} />
      <div className="h-1.5 rounded" style={{ background: palette.line }} />
      <div
        className="h-1.5 w-1/2 rounded"
        style={{ background: palette.line }}
      />
    </div>
  </div>
);

const THEME_OPTIONS: {
  key: TThemeMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: 'light', label: 'Claro', icon: <Sun size={16} /> },
  { key: 'dark', label: 'Escuro', icon: <Moon size={16} /> },
  { key: 'system', label: 'Sistema', icon: <Monitor size={16} /> },
];

const ThemeOption: React.FC<{
  option: (typeof THEME_OPTIONS)[number];
  selected: boolean;
  onSelect: () => void;
}> = ({ option, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`flex flex-col gap-2 rounded-lg border-2 p-2 text-left transition ${
      selected ? 'border-violet-500' : 'border-gray-400/30'
    }`}
  >
    <div className="h-20 overflow-hidden rounded-md border border-gray-400/20">
      {option.key === 'system' ? (
        <div className="relative h-full w-full">
          <PreviewWindow palette={PALETTES.light} />
          <div
            className="absolute inset-0"
            style={{ clipPath: 'inset(0 0 0 50%)' }}
          >
            <PreviewWindow palette={PALETTES.dark} />
          </div>
        </div>
      ) : (
        <PreviewWindow palette={PALETTES[option.key]} />
      )}
    </div>

    <div className="flex items-center gap-2">
      {option.icon}
      <Text>{option.label}</Text>
      {selected && <Check size={16} className="ml-auto text-violet-500" />}
    </div>
  </button>
);

const Settings = () => {
  const navigate = useNavigate();

  const { data } = useAuth();
  const { mode, setMode } = useTheme();

  const [section, setSection] = useState<TSettingsSection>('info');
  const [confirmLogout, setConfirmLogout] = useState(false);

  const role = data?.clinicProfile.role;

  const handleLogout = () => {
    logout();
    navigate(ROUTE_NAMES.SIGN_IN);
  };

  return (
    <FadeWrapper className="flex flex-col">
      <Title level={2} className="mb-2!">
        Configurações
      </Title>

      <Card
        className="flex-1 overflow-hidden"
        classNames={{ body: 'flex h-full p-0!' }}
      >
        <Menu
          mode="inline"
          className="w-52!"
          selectedKeys={[section]}
          onClick={({ key }) => {
            if (key === 'logout') {
              setConfirmLogout(true);
              return;
            }
            setSection(key as TSettingsSection);
          }}
          items={[
            { key: 'info', label: 'Informações', icon: <Info size={16} /> },
            {
              key: 'appearance',
              label: 'Aparência',
              icon: <Palette size={16} />,
            },
            { type: 'divider' },
            {
              key: 'logout',
              label: 'Sair',
              icon: <LogOut size={16} />,
              danger: true,
            },
          ]}
        />

        <div className="flex-1 p-6">
          {section === 'info' && (
            <div className="max-w-md">
              <Title level={4} className="mt-0!">
                Informações
              </Title>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Nome">
                  {data?.user.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Clínica">
                  {data?.clinicProfile.clinic.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Papel">
                  {role ? (
                    <Tag color={ROLE_COLORS[role]}>{translateRole(role)}</Tag>
                  ) : (
                    '—'
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {section === 'appearance' && (
            <div>
              <Title level={4} className="mt-0!">
                Aparência
              </Title>
              <Text type="secondary">
                Escolha como o sistema deve aparecer para você.
              </Text>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {THEME_OPTIONS.map((option) => (
                  <ThemeOption
                    key={option.key}
                    option={option}
                    selected={mode === option.key}
                    onSelect={() => setMode(option.key)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        title="Sair da conta"
        open={confirmLogout}
        okText="Sair"
        cancelText="Voltar"
        okButtonProps={{ danger: true }}
        onCancel={() => setConfirmLogout(false)}
        onOk={handleLogout}
      >
        Tem certeza que deseja sair da sua conta?
      </Modal>
    </FadeWrapper>
  );
};

export default Settings;
