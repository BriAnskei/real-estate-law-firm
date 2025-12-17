import {
  X,
  Activity,
  User,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Edit,
  Trash,
  Plus,
} from "lucide-react";

// Activity types enum
export type ActivityType =
  | "case_created"
  | "case_updated"
  | "stage_status_changed"
  | "task_created"
  | "task_updated"
  | "task_deleted"
  | "task_completed"
  | "hearing_scheduled"
  | "hearing_postponed"
  | "hearing_cancelled"
  | "document_uploaded"
  | "comment_added";

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user_name: string;
  user_id: string;
  created_at: string;
  metadata?: {
    old_value?: string;
    new_value?: string;
    stage_name?: string;
    task_title?: string;
    [key: string]: any;
  };
}

interface ActivityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseConcern?: string;
  isLoading?: boolean;
  activities: ActivityLog[];
}

// Helper function to get activity icon
const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "case_created":
    case "case_updated":
      return <FileText className="h-4 w-4" />;
    case "stage_status_changed":
      return <CheckCircle className="h-4 w-4" />;
    case "task_created":
      return <Plus className="h-4 w-4" />;
    case "task_updated":
      return <Edit className="h-4 w-4" />;
    case "task_deleted":
      return <Trash className="h-4 w-4" />;
    case "task_completed":
      return <CheckCircle className="h-4 w-4" />;
    case "hearing_scheduled":
    case "hearing_postponed":
    case "hearing_cancelled":
      return <Calendar className="h-4 w-4" />;
    case "document_uploaded":
      return <FileText className="h-4 w-4" />;
    case "comment_added":
      return <User className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

// Helper function to get activity color
const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "case_created":
    case "task_created":
    case "hearing_scheduled":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "case_updated":
    case "task_updated":
    case "stage_status_changed":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    case "task_deleted":
    case "hearing_cancelled":
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    case "task_completed":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "hearing_postponed":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
    case "document_uploaded":
    case "comment_added":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
  }
};

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// Mock data for demonstration
const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: "1",
    type: "case_created",
    title: "Case Created",
    description: "Case was successfully created and filed in the system",
    user_name: "Attorney Maria Santos",
    user_id: "user-001",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: "2",
    type: "stage_status_changed",
    title: "Requirements Stage Started",
    description: "Requirements stage status was changed to ongoing",
    user_name: "Attorney Maria Santos",
    user_id: "user-001",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    metadata: {
      old_value: "pending",
      new_value: "ongoing",
      stage_name: "Requirements",
    },
  },
  {
    id: "3",
    type: "task_created",
    title: "Task Added",
    description: "A new task was added to the requirements stage",
    user_name: "Attorney John Cruz",
    user_id: "user-002",
    created_at: new Date(Date.now() - 86400000 * 4 + 3600000).toISOString(),
    metadata: {
      stage_name: "Requirements",
      task_title: "Submit birth certificate",
    },
  },
  {
    id: "4",
    type: "document_uploaded",
    title: "Document Uploaded",
    description: "Birth certificate has been uploaded to the case files",
    user_name: "Client Pedro Reyes",
    user_id: "user-003",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    metadata: {
      stage_name: "Requirements",
    },
  },
  {
    id: "5",
    type: "task_completed",
    title: "Task Completed",
    description:
      "Birth certificate submission task has been marked as complete",
    user_name: "Attorney Maria Santos",
    user_id: "user-001",
    created_at: new Date(Date.now() - 86400000 * 3 + 7200000).toISOString(),
    metadata: {
      stage_name: "Requirements",
      task_title: "Submit birth certificate",
    },
  },
  {
    id: "6",
    type: "comment_added",
    title: "Comment Added",
    description: "A comment was added to the case discussion",
    user_name: "Attorney John Cruz",
    user_id: "user-002",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "7",
    type: "stage_status_changed",
    title: "Requirements Stage Completed",
    description:
      "All requirements have been fulfilled and stage marked as complete",
    user_name: "Attorney Maria Santos",
    user_id: "user-001",
    created_at: new Date(Date.now() - 86400000 * 2 + 14400000).toISOString(),
    metadata: {
      old_value: "ongoing",
      new_value: "complete",
      stage_name: "Requirements",
    },
  },
  {
    id: "8",
    type: "stage_status_changed",
    title: "Documents Stage Started",
    description: "Legal documents stage is now in progress",
    user_name: "Attorney Maria Santos",
    user_id: "user-001",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    metadata: {
      old_value: "pending",
      new_value: "ongoing",
      stage_name: "Legal Documents",
    },
  },
  {
    id: "9",
    type: "hearing_scheduled",
    title: "Hearing Scheduled",
    description: "Initial hearing has been scheduled with the court",
    user_name: "Court Administrator",
    user_id: "user-004",
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    metadata: {
      stage_name: "Hearing/Case Proper",
    },
  },
  {
    id: "10",
    type: "task_created",
    title: "Task Added",
    description: "Prepare opening statement task assigned",
    user_name: "Attorney Maria Santos",
    user_id: "user-001",
    created_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    metadata: {
      stage_name: "Legal Documents",
      task_title: "Prepare opening statement",
    },
  },
  {
    id: "11",
    type: "task_updated",
    title: "Task Updated",
    description: "Due date for opening statement preparation was extended",
    user_name: "Attorney John Cruz",
    user_id: "user-002",
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    metadata: {
      stage_name: "Legal Documents",
      task_title: "Prepare opening statement",
      old_value: "Dec 15, 2024",
      new_value: "Dec 18, 2024",
    },
  },
  {
    id: "12",
    type: "comment_added",
    title: "Comment Added",
    description: "Strategy discussion notes added to the case",
    user_name: "Attorney Maria Santos",
    user_id: "user-001",
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
];

export default function CaseActivity({
  isOpen,
  onClose,
  caseConcern = "Case",
  isLoading = false,
  activities = MOCK_ACTIVITIES, // Use mock data as default
}: ActivityLogsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="bg-white dark:bg-gray-800 flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#D4AF37]/10 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Activity Logs
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {caseConcern} - All activity records
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {/* Loading Skeleton */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-white/[0.1] rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                        <div className="h-3 w-20 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-full bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-16 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                        <div className="h-3 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : MOCK_ACTIVITIES.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <Activity className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Activity Yet
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                  No activities have been recorded for this case yet. Activities
                  will appear here as actions are taken.
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* Activity Count Badge */}
                <div className="mb-6 inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Total Activities:
                  </span>
                  <span className="bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {activities.length}
                  </span>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-4">
                  {MOCK_ACTIVITIES.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="relative flex gap-4 group"
                    >
                      {/* Timeline Line */}
                      {index !== activities.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                      )}

                      {/* Activity Icon */}
                      <div className="flex-shrink-0 relative z-10">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${getActivityColor(
                            activity.type
                          )} transition-transform group-hover:scale-110`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all group-hover:border-[#D4AF37] group-hover:shadow-md">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                              {activity.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {formatRelativeTime(activity.created_at)}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {activity.description}
                          </p>

                          {/* Metadata */}
                          {activity.metadata &&
                            Object.keys(activity.metadata).length > 0 && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mb-3 space-y-1.5">
                                {activity.metadata.old_value &&
                                  activity.metadata.new_value && (
                                    <div className="text-xs">
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Changed from{" "}
                                      </span>
                                      <span className="font-medium text-red-600 dark:text-red-400 line-through">
                                        {activity.metadata.old_value}
                                      </span>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {" "}
                                        to{" "}
                                      </span>
                                      <span className="font-medium text-green-600 dark:text-green-400">
                                        {activity.metadata.new_value}
                                      </span>
                                    </div>
                                  )}
                                {activity.metadata.stage_name && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Stage:</span>{" "}
                                    {activity.metadata.stage_name}
                                  </div>
                                )}
                                {activity.metadata.task_title && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Task:</span>{" "}
                                    {activity.metadata.task_title}
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Footer */}
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <User className="h-3 w-3" />
                            <span className="font-medium">
                              {activity.user_name}
                            </span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(activity.created_at).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-white dark:bg-gray-800 flex items-center justify-end gap-3 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 dark:bg-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        /* Custom Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Dark mode scrollbar */
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .dark .custom-scrollbar {
          scrollbar-color: #4b5563 transparent;
        }
      `}</style>
    </div>
  );
}
