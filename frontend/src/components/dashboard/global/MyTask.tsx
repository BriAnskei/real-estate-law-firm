import { FC } from "react";
import {
  AlertCircle,
  Clock,
  Calendar,
  Briefcase,
  CheckCircle,
} from "lucide-react";

/* ----------------------------- Types ----------------------------- */

type TaskStage = "MANAGE_REQUIREMENTS" | "FILING_DOCS" | "HEARING";

type TaskItem = {
  task_title: string;
  case_concern: string;
  due_date: string;
  stage_name: TaskStage;
};

type MyTasksCardProps = {
  overDueTasks?: TaskItem[];
  dueIn3Days?: TaskItem[];
  dueIn5Days?: TaskItem[];

  loading: boolean;
};

const renderSkeletonTask = (key: number) => (
  <div
    key={key}
    className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-4 mb-3"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
      <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const renderLoadingState = () => (
  <>
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>
      {[1, 2].map((i) => renderSkeletonTask(i))}
    </div>

    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>
      {[3, 4].map((i) => renderSkeletonTask(i))}
    </div>

    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>
      {[5, 6].map((i) => renderSkeletonTask(i))}
    </div>
  </>
);

const MyTasksCard: FC<MyTasksCardProps> = ({
  overDueTasks,
  dueIn3Days,
  dueIn5Days,

  loading,
}) => {
  const isComponentReady =
    loading || !overDueTasks || !dueIn3Days || !dueIn5Days;

  const hasNoTasks =
    !loading &&
    overDueTasks?.length === 0 &&
    dueIn3Days?.length === 0 &&
    dueIn5Days?.length === 0;

  const stageConfig: Record<
    TaskStage,
    { label: string; bgColor: string; textColor: string }
  > = {
    MANAGE_REQUIREMENTS: {
      label: "CR",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    FILING_DOCS: {
      label: "LD",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-400",
    },
    HEARING: {
      label: "HC",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-400",
    },
  };

  const renderTask = (key: number, task: TaskItem, isOverdue: boolean) => (
    <div
      key={key}
      className={`rounded-lg border p-4 mb-3 transition-colors ${
        isOverdue
          ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 hover:border-[#D4AF37] dark:hover:border-[#D4AF37]"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-semibold text-gray-800 dark:text-white text-sm">
          {task.task_title}
        </h5>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
            stageConfig[task.stage_name].bgColor
          } ${stageConfig[task.stage_name].textColor}`}
        >
          {stageConfig[task.stage_name].label}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Briefcase className="w-3 h-3" />
          {task.case_concern}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-3 h-3" />
          <span
            className={
              isOverdue
                ? "text-red-600 dark:text-red-400 font-medium"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            Due:{" "}
            {new Date(task.due_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex flex-col"
      style={{ height: "547px" }}
    >
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-2">
          My Tasks
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tasks organized by due date
        </p>
      </div>

      <div className="overflow-y-auto flex-1 space-y-6 custom-scrollbar">
        {isComponentReady ? (
          renderLoadingState()
        ) : hasNoTasks ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-base">
              No tasks at this time
            </p>
          </div>
        ) : (
          <>
            {overDueTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h4 className="text-base font-semibold text-red-600 dark:text-red-400">
                    Overdue ({overDueTasks.length})
                  </h4>
                </div>
                {overDueTasks.map((task, index) =>
                  renderTask(index, task, true)
                )}
              </div>
            )}

            {dueIn3Days.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                    Due In 3 Days ({dueIn3Days.length})
                  </h4>
                </div>
                {dueIn3Days.map((task, index) =>
                  renderTask(index, task, false)
                )}
              </div>
            )}

            {dueIn5Days.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                    Due in 3 Days ({dueIn5Days.length})
                  </h4>
                </div>
                {dueIn5Days.map((task, index) =>
                  renderTask(index, task, false)
                )}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
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

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

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
};

export default MyTasksCard;
