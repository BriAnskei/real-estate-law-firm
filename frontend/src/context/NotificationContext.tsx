import React, { createContext, useContext, useEffect, useState } from "react";
import { NotificationType } from "../types/NotificationType";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { NotificationApi } from "../util/api/notification.api";

type NotificationContextType = {
  notifications: NotificationType[];
  notificationLoading: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [notifications, setNotifications] = useState<
    NotificationType[] | undefined
  >(undefined);
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      if (!isAuthenticated) return;

      try {
        setNotificationLoading(true);
        const response = await NotificationApi.fetchAll();

        setNotifications(response);
      } catch (error) {
        console.error(error);
      }
    }

    fetch();
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: notifications ?? [],
        notificationLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
