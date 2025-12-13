import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { notificationType, NotificationType } from "../types/NotificationType";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { NotificationApi } from "../util/api/notification.api";
import { useToast } from "../hooks/useToast";

type NotificationContextType = {
  notifications: NotificationType[];
  notificationLoading: boolean;

  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  // helper helper functions
  getCategoryLabel: (type: notificationType) => string;
  getRelativeTime: (timestamp: string) => string;
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

        await fetchAllNotifs();
        await fetchAllDue();
      } catch (error) {
        console.error(error);
      }
    }

    fetch();
  }, [isAuthenticated]);

  const fetchAllNotifs = useCallback(async () => {
    try {
      const response = await NotificationApi.fetchAll();

      setNotifications(response);
    } catch (error) {
      throw error;
    }
  }, []);

  const fetchAllDue = useCallback(async () => {
    try {
      const response = await NotificationApi.fetchCloseDue();

      if (!response) return;

      setNotifications((prev) => [...(prev ?? []), ...response]);
    } catch (error) {
      throw error;
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await NotificationApi.markAsRead(id);
      setNotifications((prev) =>
        (prev ?? []).map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationApi.markAllAsRead();
      // fetch the latest update

      const response = await NotificationApi.fetchAll();

      setNotifications(response);
    } catch (error) {
      console.error(error);
    }
  };

  // helper functions
  const getCategoryLabel = (type: notificationType): string => {
    switch (type) {
      case "CASE_CONSULTATION":
      case "ONGOING_CASE":
      case "CASE_COMPLETION":
      case "CASE_STAGE_STATUS":
        return "Case";
      case "TASK_RELATED":
        return "Task";

      case "ACCOUNTS_RELATED":
        return "accounts";
      default:
        return "Notification";
    }
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: notifications ?? [],
        notificationLoading,

        markAsRead,
        markAllAsRead,

        getCategoryLabel,
        getRelativeTime,
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
