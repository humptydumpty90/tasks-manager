import { createContext, useContext } from 'react';
import { notification } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';

const NotificationContext = createContext<NotificationInstance | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={ api }>
      { contextHolder }
      { children }
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const api = useContext(NotificationContext);

  if (!api) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return api;
};
