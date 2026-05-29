import { createContext, useContext, type ReactNode } from 'react';

import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

type TNotifyProps = {
  type: NotificationType;
  title: React.ReactNode;
  description: React.ReactNode;
};

type NotificationContextType = {
  notify: (props: TNotifyProps) => void;
};

const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType,
);

//eslint-disable-next-line
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }

  return context;
};

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  const notify = ({ type, title, description }: TNotifyProps) => {
    api.destroy();

    api[type]({ title, description });
  };

  const value: NotificationContextType = {
    notify,
  };

  return (
    <>
      {contextHolder}

      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
    </>
  );
};

export default NotificationProvider;
