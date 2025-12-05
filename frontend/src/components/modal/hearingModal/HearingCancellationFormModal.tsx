import { X, AlertTriangle } from "lucide-react";

interface HearingCancellationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  reason: string;
  setReason: (reason: string) => void;
  hearingType?: string;
}

export default function HearingCancellationFormModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  reason,
  setReason,
  hearingType = "sdfsd",
}: HearingCancellationFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      <div className="relative z-10 w-full max-w-lg mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Cancel Hearing
                </h3>
                {hearingType && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {hearingType}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to cancel this hearing? Please provide a
                reason for the cancellation below. This action cannot be undone
                immediately.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="cancellation-reason"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Reason for Cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancellation-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Client requested rescheduling, Judge unavailable..."
                rows={4}
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 
                  transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 
                  dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-red-500
                  disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-700 px-6 py-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 
                transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 
                dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
            >
              Keep Schedule
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading || !reason.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white 
                transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
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
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
