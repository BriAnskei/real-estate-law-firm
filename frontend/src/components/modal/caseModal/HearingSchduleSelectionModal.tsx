import { useState } from "react";
import { X, Search, Calendar, CheckCircle2 } from "lucide-react";
import { HearingType } from "../../../types/HearingTypes";
import { HearingStatus } from "../../../hooks/case/hearing/useHearing";

interface HearingSchedule {
  id: string;
  type: string;
  scheduled_date: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface HearingScheduleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedHearingId: string) => void;
  currentSelectedId?: string;
  isSubmitting?: boolean;
  isLoading?: boolean;
  Hearings: HearingType[];

  query: string;
  setQuery: (q: string) => void;
  status: HearingStatus | "all";
  setStatus: (s: HearingStatus | undefined) => void;
  clearFilter: () => void;
}

export default function HearingScheduleSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  currentSelectedId,
  isSubmitting = false,
  isLoading = false,
  Hearings,

  query,
  setQuery,
  status,
  setStatus,
  clearFilter,
}: HearingScheduleSelectionModalProps) {
  const [selectedHearingId, setSelectedHearingId] = useState<string | null>(
    currentSelectedId || null
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: HearingSchedule["status"]) => {
    const styles = {
      scheduled:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const handleConfirm = () => {
    if (selectedHearingId) {
      onConfirm(selectedHearingId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div className="relative z-10 w-full max-w-4xl mx-4 animate-fadeIn max-h-[90vh] flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Select Hearing Schedule
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose a hearing to assign tasks
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

          {/* Search and Filter Section */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {/* Search Input */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by hearing type"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent
                    dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500
                    transition-all duration-300"
                />
              </div>

              {/* Status Filter and Reset */}
              <div className="flex items-center gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as HearingStatus)}
                  className="rounded-lg border-2 border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-900
                    transition-all focus:border-[#D4AF37] focus:outline-none dark:border-white/[0.1]
                    dark:bg-white/[0.05] dark:text-white/90 cursor-pointer hover:border-gray-300
                    dark:hover:border-white/[0.2] [&>option]:bg-white [&>option]:text-gray-900
                    dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={clearFilter}
                  className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5
                    text-sm font-medium text-gray-700 transition-all hover:border-[#D4AF37] hover:bg-gray-50
                    active:scale-95 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-gray-300
                    dark:hover:border-[#D4AF37] dark:hover:bg-white/[0.08] whitespace-nowrap"
                  title="Reset all filters"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Section - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <div className="h-[400px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-white/[0.05]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Select
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Hearing Type
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Scheduled Date
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={`skeleton-${index}`}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <div className="h-4 w-4 bg-gray-200 dark:bg-white/[0.1] rounded-full animate-pulse" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 w-40 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-6 w-24 bg-gray-200 dark:bg-white/[0.1] rounded-full animate-pulse" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-white/[0.05]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Select
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Hearing Type
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Scheduled Date
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[#D4AF37] dark:text-[#D4AF37]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Hearings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              No hearings found
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Try adjusting your filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      Hearings.map((hearing) => {
                        const isCurrentlySelected =
                          hearing.id === currentSelectedId;
                        const isSelected = hearing.id === selectedHearingId;

                        return (
                          <tr
                            key={hearing.id}
                            className={`transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                              isSelected
                                ? "bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10"
                                : ""
                            }`}
                            onClick={() => setSelectedHearingId(hearing.id!)}
                          >
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="hearing-selection"
                                  checked={isSelected}
                                  onChange={() =>
                                    setSelectedHearingId(hearing.id!)
                                  }
                                  className="h-4 w-4 text-[#D4AF37] border-gray-300 focus:ring-[#D4AF37] cursor-pointer"
                                />
                                {isCurrentlySelected && (
                                  <span className="flex items-center gap-1 text-xs text-[#D4AF37] font-medium">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Current
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-800 dark:text-white/90">
                                {hearing.type}
                              </span>
                            </td>

                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(hearing.scheduled_date)}
                              </span>
                            </td>

                            <td className="px-5 py-4 whitespace-nowrap">
                              {getStatusBadge(hearing.status!)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedHearingId ? (
                <span>
                  Selected:{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Hearings.find((h) => h.id === selectedHearingId)?.type}
                  </span>
                </span>
              ) : (
                <span>No hearing selected</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedHearingId || isSubmitting}
                className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37] flex items-center gap-2"
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
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Selection
                  </>
                )}
              </button>
            </div>
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

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C4A037;
        }
      `}</style>
    </div>
  );
}
