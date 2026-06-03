import { theme as antdTheme, type ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#8b5cf6',
    colorInfo: '#8b5cf6',
    colorSuccess: '#4ade80',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorLink: '#3b82f6',
    fontSize: 14,
    sizeStep: 4,
    sizeUnit: 4,
    colorTextBase: '#111827',
    colorBorder: '#d1d5db',
    borderRadius: 8,
    fontFamily: 'Inter',
  },
  components: {
    Layout: {
      headerBg: '#0000',
      siderBg: 'rgb(245,245,245)',
    },
    Segmented: {
      itemSelectedBg: '#8b5cf6',
      itemSelectedColor: '#fff',
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#8b5cf6',
    colorInfo: '#8b5cf6',
    colorSuccess: '#4ade80',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorLink: '#3b82f6',
    fontSize: 14,
    sizeStep: 4,
    sizeUnit: 4,
    borderRadius: 8,
    fontFamily: 'Inter',
  },
  components: {
    Layout: {
      headerBg: '#0000',
      siderBg: '#1f1f1f',
    },
    Segmented: {
      itemSelectedBg: '#8b5cf6',
      itemSelectedColor: '#fff',
    },
    Menu: {
      darkItemColor: '#e5e7eb',
      darkItemHoverColor: '#ffffff',
      darkItemSelectedColor: '#ffffff',
    },
    Notification: {
      colorBgElevated: '#1f1f1f',
      colorText: '#e5e7eb',
      colorTextHeading: '#f9fafb',
      colorIcon: '#9ca3af',
      colorIconHover: '#e5e7eb',
      boxShadow:
        '0 6px 16px 0 rgba(0,0,0,0.45), 0 3px 6px -4px rgba(0,0,0,0.6), 0 9px 28px 8px rgba(0,0,0,0.3)',
    },
  },
};
