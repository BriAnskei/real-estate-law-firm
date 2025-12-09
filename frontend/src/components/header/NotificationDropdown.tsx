import { useState } from "react";
import { UserCircle } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useNotifications } from "../../context/NotificationContext";

// Types
type notificationType =
  | "NEW_CASE"
  | "NEW_TASK"
  | "TASK_COMMENT"
  | "TASK_DUE_SOON"
  | "STAGE_COMPLETED"
  | "CASE_COMPLETED";

type NotificationModel = {
  id?: string;
  notification: string;
  user_id: string;
  type: notificationType;
  related_case_id?: string;
  related_task_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Mock data
const mockNotifications: NotificationModel[] = [
  {
    id: "1",
    notification: "new_case_assigned",
    user_id: "user_001",
    type: "NEW_CASE",
    related_case_id: "case_123",
    message: "New case 'Smith vs. Johnson' has been assigned to you",
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
  },
  {
    id: "2",
    notification: "task_comment",
    user_id: "user_002",
    type: "TASK_COMMENT",
    related_task_id: "task_456",
    message: "Sarah Williams commented on your task 'File motion to dismiss'",
    is_read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
  },
  {
    id: "3",
    notification: "task_due_soon",
    user_id: "user_001",
    type: "TASK_DUE_SOON",
    related_task_id: "task_789",
    message: "Task 'Review discovery documents' is due in 2 hours",
    is_read: true,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
  },
  {
    id: "4",
    notification: "stage_completed",
    user_id: "user_003",
    type: "STAGE_COMPLETED",
    related_case_id: "case_456",
    message: "Discovery stage completed for case 'Martinez Estate'",
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
  },
  {
    id: "5",
    notification: "new_task",
    user_id: "user_004",
    type: "NEW_TASK",
    related_task_id: "task_101",
    message: "New task assigned: 'Prepare witness statement'",
    is_read: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hrs ago
  },
  {
    id: "6",
    notification: "case_completed",
    user_id: "user_001",
    type: "CASE_COMPLETED",
    related_case_id: "case_789",
    message: "Case 'Thompson LLC Litigation' has been closed",
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "7",
    notification: "task_comment",
    user_id: "user_005",
    type: "TASK_COMMENT",
    related_task_id: "task_202",
    message: "Michael Chen mentioned you in a comment",
    is_read: false,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// Helper functions
const getCategoryLabel = (type: notificationType): string => {
  switch (type) {
    case "NEW_CASE":
    case "STAGE_COMPLETED":
    case "CASE_COMPLETED":
      return "Case";
    case "NEW_TASK":
    case "TASK_COMMENT":
    case "TASK_DUE_SOON":
      return "Task";
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

export default function NotificationDropdown() {
  const { notificationLoading, notifications } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const hasUnread = notifications.some((n) => !n.is_read);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleBellClick = () => {
    toggleDropdown();
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center transition-all duration-300 bg-white border-2 border-[#D4AF37] rounded-full h-11 w-11 hover:bg-[#D4AF37] dark:bg-gray-900 dark:border-[#D4AF37] dark:hover:bg-[#D4AF37] group"
        onClick={handleBellClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-[#D4AF37] ${
            !hasUnread ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-[#D4AF37] rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current text-[#D4AF37] group-hover:text-white dark:group-hover:text-white transition-colors duration-300"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border-2 border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#D4AF37]">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-600 transition dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37]"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <DropdownItem
                onItemClick={closeDropdown}
                className={`flex gap-3 rounded-lg border-b border-gray-200 p-3 px-4.5 py-3 transition-colors duration-200 dark:border-gray-700 ${
                  !notification.is_read
                    ? "bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 dark:bg-[#D4AF37]/20 dark:hover:bg-[#D4AF37]/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-[#D4AF37]" />
                  {!notification.is_read && (
                    <span className="absolute bottom-0 right-0 z-10 h-2.5 w-2.5 rounded-full border-[1.5px] border-white bg-[#D4AF37] dark:border-gray-900"></span>
                  )}
                </span>

                <span className="block flex-1 min-w-0">
                  <span className="mb-1.5 block text-sm text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </span>

                  <span className="flex items-center gap-2 text-gray-500 text-xs dark:text-gray-400">
                    <span>{getCategoryLabel(notification.type)}</span>
                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                    <span>{getRelativeTime(notification.created_at)}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
        <button className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border-2 border-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white dark:border-[#D4AF37] dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-[#D4AF37] dark:hover:text-white transition-all duration-300">
          View All Notifications
        </button>
      </Dropdown>
    </div>
  );
}
