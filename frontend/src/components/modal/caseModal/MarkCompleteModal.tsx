import { CheckCircle, X } from "lucide-react";

type MarkCompleteModalProp = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle?: string;
  isMarking: boolean;
};

export function MarkCompleteModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  isMarking,
}: MarkCompleteModalProp) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isMarking ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Mark Task Complete
              </h2>
            </div>
            <button
              onClick={isMarking ? undefined : onClose}
              disabled={isMarking}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to mark this task as complete?
            </p>

            {taskTitle && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4 border-l-4 border-green-500">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Task Title
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {taskTitle}
                </p>
              </div>
            )}

            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              This action cannot be undone.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
            <button
              onClick={onClose}
              disabled={isMarking}
              className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isMarking}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
            >
              {isMarking ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Marking...
                </span>
              ) : (
                "Mark Complete"
              )}
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
      `}</style>
    </div>
  );
}
