import { useState } from "react";
import { UserCircle, Bell, Filter } from "lucide-react";
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

// Mock data - 15 notifications
const mockNotifications: NotificationModel[] = [
  {
    id: "1",
    notification: "new_case_assigned",
    user_id: "user_001",
    type: "NEW_CASE",
    related_case_id: "case_123",
    message: "New case 'Smith vs. Johnson' has been assigned to you",
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    notification: "task_comment",
    user_id: "user_002",
    type: "TASK_COMMENT",
    related_task_id: "task_456",
    message: "Sarah Williams commented on your task 'File motion to dismiss'",
    is_read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    notification: "task_due_soon",
    user_id: "user_001",
    type: "TASK_DUE_SOON",
    related_task_id: "task_789",
    message: "Task 'Review discovery documents' is due in 2 hours",
    is_read: true,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    notification: "stage_completed",
    user_id: "user_003",
    type: "STAGE_COMPLETED",
    related_case_id: "case_456",
    message: "Discovery stage completed for case 'Martinez Estate'",
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    notification: "new_task",
    user_id: "user_004",
    type: "NEW_TASK",
    related_task_id: "task_101",
    message: "New task assigned: 'Prepare witness statement'",
    is_read: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    notification: "case_completed",
    user_id: "user_001",
    type: "CASE_COMPLETED",
    related_case_id: "case_789",
    message: "Case 'Thompson LLC Litigation' has been closed",
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    notification: "task_comment",
    user_id: "user_005",
    type: "TASK_COMMENT",
    related_task_id: "task_202",
    message: "Michael Chen mentioned you in a comment",
    is_read: false,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    notification: "new_case_assigned",
    user_id: "user_006",
    type: "NEW_CASE",
    related_case_id: "case_321",
    message: "New case 'Anderson Corporation Dispute' has been assigned to you",
    is_read: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "9",
    notification: "task_due_soon",
    user_id: "user_001",
    type: "TASK_DUE_SOON",
    related_task_id: "task_303",
    message: "Task 'Submit appeal brief' is due tomorrow",
    is_read: true,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "10",
    notification: "stage_completed",
    user_id: "user_007",
    type: "STAGE_COMPLETED",
    related_case_id: "case_654",
    message: "Pre-trial stage completed for case 'Roberts Family Trust'",
    is_read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "11",
    notification: "new_task",
    user_id: "user_008",
    type: "NEW_TASK",
    related_task_id: "task_404",
    message: "New task assigned: 'Draft settlement agreement'",
    is_read: false,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "12",
    notification: "task_comment",
    user_id: "user_009",
    type: "TASK_COMMENT",
    related_task_id: "task_505",
    message:
      "Jennifer Lopez replied to your comment on 'Review contract terms'",
    is_read: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "13",
    notification: "case_completed",
    user_id: "user_001",
    type: "CASE_COMPLETED",
    related_case_id: "case_987",
    message: "Case 'Peterson v. State' has been successfully resolved",
    is_read: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "14",
    notification: "new_case_assigned",
    user_id: "user_010",
    type: "NEW_CASE",
    related_case_id: "case_555",
    message: "New case 'Miller Property Rights' has been assigned to you",
    is_read: false,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "15",
    notification: "task_due_soon",
    user_id: "user_001",
    type: "TASK_DUE_SOON",
    related_task_id: "task_606",
    message: "Task 'Finalize deposition schedule' is due this week",
    is_read: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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

export default function NotificationsPage() {
  const { notificationLoading, notifications } = useNotifications();

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Unread" | "Case" | "Task"
  >("All");

  const handleFilterSelect = (filter: "All" | "Unread" | "Case" | "Task") => {
    setSelectedFilter(filter);
    setFilterOpen(false);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unread") return !notification.is_read;
    if (selectedFilter === "Case") {
      return ["NEW_CASE", "STAGE_COMPLETED", "CASE_COMPLETED"].includes(
        notification.type
      );
    }
    if (selectedFilter === "Task") {
      return ["NEW_TASK", "TASK_COMMENT", "TASK_DUE_SOON"].includes(
        notification.type
      );
    }
    return true;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.is_read).length;

  return (
    <div>
      {/* Page Breadcrumb would go here */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Sticky Header - Filter and Count */}
        <div className="sticky top-0 z-10 bg-white dark:bg-white/[0.03] border-b border-gray-200 dark:border-gray-800 px-5 py-5 xl:px-10 xl:py-6">
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filter: {selectedFilter}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {filterOpen && (
                <div className="absolute left-0 z-10 mt-2 w-40 rounded-lg border-2 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="py-1">
                    {["All", "Unread", "Case", "Task"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() =>
                          handleFilterSelect(
                            filter as "All" | "Unread" | "Case" | "Task"
                          )
                        }
                        className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
                          selectedFilter === filter
                            ? "bg-[#D4AF37] text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="px-3 py-1 text-xs font-semibold text-white bg-[#D4AF37] rounded-full">
                  {unreadCount} Unread
                </span>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredNotifications.length} notification
                {filteredNotifications.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Notifications List */}
        <div className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar px-5 py-5 xl:px-10 xl:py-6">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 rounded-lg border border-gray-200 p-4 transition-colors duration-200 dark:border-gray-700 ${
                    !notification.is_read
                      ? "bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 dark:bg-[#D4AF37]/20 dark:hover:bg-[#D4AF37]/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
                      <span>{getRelativeTime(notification.created_at!)}</span>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Bell className="w-10 h-10 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                No notifications found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                {selectedFilter === "All"
                  ? "You're all caught up! No notifications to display."
                  : `No ${selectedFilter.toLowerCase()} notifications at the moment.`}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c19b2e;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4af37;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e5c158;
        }
      `}</style>
    </div>
  );
}
