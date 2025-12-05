import { X, History } from "lucide-react";
import { HearingPostponementsType } from "../../../types/HearingPostponementsType";
import { formatDateTime } from "../../../util/DateDecoder";
import { useCaseTransaction } from "../../../context/CaseTransactionContext";

interface PostponementHistoryRecord {
  id: string;
  oldDate: string;
  newDate: string;
  reason: string;
  postponedAt: string;
}

interface HearingPostponementHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearingType?: string;
  isLoading?: boolean;
  postponements: HearingPostponementsType[];
}

// Mock data for demonstration
const mockPostponementHistory: PostponementHistoryRecord[] = [
  {
    id: "1",
    oldDate: "2024-01-15 09:00 AM",
    newDate: "2024-01-22 10:00 AM",
    reason:
      "Conflict with another court hearing. The presiding judge has a prior commitment that cannot be rescheduled.",
    postponedAt: "2024-01-10 02:30 PM",
  },
  {
    id: "2",
    oldDate: "2024-01-22 10:00 AM",
    newDate: "2024-02-05 02:00 PM",
    reason:
      "Defense counsel requested postponement due to medical emergency requiring immediate attention.",
    postponedAt: "2024-01-20 11:15 AM",
  },
  {
    id: "3",
    oldDate: "2024-02-05 02:00 PM",
    newDate: "2024-02-12 09:30 AM",
    reason:
      "Key witness unavailable on the scheduled date. Witness is out of the country for urgent family matters.",
    postponedAt: "2024-02-01 04:45 PM",
  },
];

export default function HearingPostponementHistoryModal({
  isOpen,
  onClose,
  hearingType = "Hearing",
  isLoading = false,
  postponements,
}: HearingPostponementHistoryModalProps) {
  if (!isOpen) return null;
  const { formatDate } = useCaseTransaction();
  const history = mockPostponementHistory;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-5xl mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="bg-white dark:bg-gray-800 flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Postponement History
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {hearingType} - All postponement records
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
              <div className="p-6">
                {/* Loading Skeleton for Count Badge */}
                <div className="mb-4 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                </div>

                {/* Desktop Table Loading Skeleton */}
                <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.05]">
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Original Date
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Rescheduled To
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Reason
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Postponed At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <tr
                            key={`skeleton-${index}`}
                            className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                          >
                            <td className="px-5 py-4">
                              <div className="h-4 w-40 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                            </td>
                            <td className="px-5 py-4">
                              <div className="h-4 w-40 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                            </td>
                            <td className="px-5 py-4">
                              <div className="space-y-2">
                                <div className="h-3 w-full bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                                <div className="h-3 w-3/4 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card Loading Skeleton */}
                <div className="md:hidden space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`skeleton-mobile-${index}`}
                      className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-7 w-7 bg-gray-200 dark:bg-white/[0.1] rounded-full animate-pulse" />
                        <div className="h-3 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="h-3 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse mb-2" />
                          <div className="h-4 w-40 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                        </div>

                        <div>
                          <div className="h-3 w-28 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse mb-2" />
                          <div className="h-4 w-40 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                        </div>

                        <div>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse mb-2" />
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                            <div className="h-3 w-5/6 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : postponements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <History className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Postponement History
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                  This hearing has never been postponed. All scheduled dates
                  have been kept as originally planned.
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* History Count Badge */}
                <div className="mb-4 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Total Postponements:
                  </span>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {postponements.length}
                  </span>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.05]">
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Original Date
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Rescheduled To
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Reason
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                            Postponed At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {postponements.map((record, index) => (
                          <tr
                            key={record.id}
                            className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-[10px] font-bold text-red-600 dark:text-red-400">
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-800 dark:text-white/90 line-through decoration-red-500">
                                  {formatDateTime(record.old_date)}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-green-600 dark:text-green-400">
                                {formatDateTime(record.new_date)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {record.reason}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(record.created_at)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {history.map((record, index) => (
                    <div
                      key={record.id}
                      className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {record.postponedAt}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Original Date
                          </label>
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-through decoration-red-500 mt-0.5">
                            {record.oldDate}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Rescheduled To
                          </label>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-0.5">
                            {formatDateTime(record.newDate)}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Reason
                          </label>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                            {record.reason}
                          </p>
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

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
