import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

import { theme, darkTheme } from '@assets/theme';
import { LOCAL_STORAGE_THEME_KEY } from '@constants/LOCAL_STORAGE_KEYS';

export type TThemeMode = 'light' | 'dark' | 'system';

type TThemeContext = {
  mode: TThemeMode;
  isDark: boolean;
  setMode: (mode: TThemeMode) => void;
};

const ThemeContext = createContext<TThemeContext | null>(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';

const getStoredMode = (): TThemeMode => {
  const stored = window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

  return stored === 'light' || stored === 'dark' || stored === 'system'
    ? stored
    : 'system';
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<TThemeMode>(getStoredMode);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia(DARK_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const setMode = (next: TThemeMode) => {
    window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, next);
    setModeState(next);
  };

  const isDark = mode === 'dark' || (mode === 'system' && systemDark);

  const value = useMemo(() => ({ mode, isDark, setMode }), [mode, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={isDark ? darkTheme : theme} locale={ptBR}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

//eslint-disable-next-line
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeProvider;
