import { X, Calendar, FileX, Info } from "lucide-react";
import { formatDateTime } from "../../../util/DateDecoder";

interface HearingCancellationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearingType?: string;
  scheduledDate?: string; // Expecting formatted date string
  cancellationDate?: string; // Expecting formatted date string
  reason?: string;
  isLoading?: boolean;
}

export default function HearingCancellationViewModal({
  isOpen,
  onClose,
  hearingType,
  scheduledDate,
  cancellationDate,
  reason,
  isLoading = false,
}: HearingCancellationViewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <FileX className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Cancellation Details
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  View reason for cancellation
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
          <div className="px-6 py-6 space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                {/* Info Card Skeleton */}
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-2 flex flex-col items-end">
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>

                {/* Reason Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-full h-[100px] rounded-lg bg-gray-100 dark:bg-gray-800/50 border-2 border-transparent animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                {/* Hearing Info Card */}
                <div className="rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] p-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Hearing Type
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {hearingType || "—"}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        Scheduled Date
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDateTime(scheduledDate!) || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date of Cancellation
                    </div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatDateTime(cancellationDate!) || "—"}
                    </p>
                  </div>
                </div>

                {/* Reason Section */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <Info className="h-4 w-4 text-gray-400" />
                    Reason for Cancellation
                  </label>
                  <div className="w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300 min-h-[100px]">
                    {reason || (
                      <span className="italic text-gray-400">
                        No reason provided.
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 flex items-center justify-end border-t border-gray-100 dark:border-gray-700 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-white border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
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
