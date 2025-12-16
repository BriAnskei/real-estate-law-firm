import { useState } from "react";
import { Bell, Filter, Check } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationsPage() {
  const {
    notifications,
    getCategoryLabel,
    getRelativeTime,

    markAllAsRead,
    markAsRead,

    getNotificationIcon,
  } = useNotifications();

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Unread" | "Case" | "Task"
  >("All");
  const [hoveredNotificationId, setHoveredNotificationId] = useState<
    string | null
  >(null);

  const handleFilterSelect = (filter: "All" | "Unread" | "Case" | "Task") => {
    setSelectedFilter(filter);
    setFilterOpen(false);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unread") return !notification.is_read;
    if (selectedFilter === "Case") {
      return [
        "CASE_CONSULTATION",
        "ONGOING_CASE",
        "CASE_COMPLETION",
        "CASE_STAGE_STATUS",
      ].includes(notification.type);
    }
    if (selectedFilter === "Task") {
      return ["TASK_RELATED"].includes(notification.type);
    }
    return true;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div className="rounded-2xl border border-gray-200  bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Sticky Header - Filter and Count */}
        <div className="sticky top-0 z-10 bg-white dark:bg-white/[0.03] border-b border-gray-200 dark:border-gray-800 px-5 py-5 xl:px-10 xl:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                  <div className="absolute left-0 z-1000 mt-2 w-40 rounded-lg border-2 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
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

              {/* Mark All as Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
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
        <div className="h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar px-5 pt-5 pb-2 xl:px-10 xl:pt-6 xl:pb-3">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onMouseEnter={() =>
                    setHoveredNotificationId(notification.id!)
                  }
                  onMouseLeave={() => setHoveredNotificationId(null)}
                  className={`flex gap-3 rounded-lg border border-gray-200 p-4 transition-colors duration-200 dark:border-gray-700 relative ${
                    !notification.is_read
                      ? "bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 dark:bg-[#D4AF37]/20 dark:hover:bg-[#D4AF37]/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
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

                  {/* Mark as Read Button - Shows on Hover */}
                  {!notification.is_read &&
                    hoveredNotificationId === notification.id! && (
                      <button
                        onClick={() => markAsRead(notification.id!)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37] hover:bg-[#c19b2e] text-white transition-all duration-200 shadow-md"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
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
