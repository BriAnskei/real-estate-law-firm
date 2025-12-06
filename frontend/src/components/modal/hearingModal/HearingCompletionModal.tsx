import { X, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";

interface HearingCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hearingType: string;
  scheduledDate: string;
  isSubmitting?: boolean;
}

export default function HearingCompletionModal({
  isOpen,
  onClose,
  onConfirm,
  hearingType,
  scheduledDate,
  isSubmitting = false,
}: HearingCompletionModalProps) {
  if (!isOpen) return null;

  const { formatDate } = useCaseTransaction();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div className="relative z-10 w-full max-w-md mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Mark as Complete
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Confirm hearing completion
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-4">
            {/* Info Alert */}
            <div className="flex gap-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  You are about to mark this hearing as completed. This action
                  will update the hearing status and cannot be easily undone.
                </p>
              </div>
            </div>

            {/* Hearing Details */}
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Hearing Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {hearingType}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Scheduled Date
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(scheduledDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Are you sure you want to mark this hearing as{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  completed
                </span>
                ?
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
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
                  Marking Complete...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Mark as Complete
                </>
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
