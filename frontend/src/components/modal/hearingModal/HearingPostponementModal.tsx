import React from "react";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import { PostponeInputType } from "../../../hooks/case/hearing/usePostponedHearingFormModal";

interface HearingPostponementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  onChangeHandler: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  input: PostponeInputType;
  hearingType?: string;
  currentSchedule?: string;
}

export default function HearingPostponementModal({
  isOpen,
  onClose,
  onSubmit,
  submitting = false,
  input,
  onChangeHandler,
  hearingType = "Hearing",
  currentSchedule,
}: HearingPostponementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={submitting ? undefined : onClose}
      />

      <div className="relative z-10 w-full max-w-2xl mx-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Postpone Hearing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Reschedule {hearingType} to a new date and time
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-5">
            {/* Current Schedule Info */}
            {currentSchedule && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                      Current Schedule
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {currentSchedule}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Schedule Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Calendar className="inline h-4 w-4 mr-1.5 mb-0.5" />
                  New Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="new_date"
                  value={input.new_date}
                  onChange={onChangeHandler}
                  disabled={submitting}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Clock className="inline h-4 w-4 mr-1.5 mb-0.5" />
                  New Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="new_time"
                  value={input.new_time}
                  onChange={onChangeHandler}
                  disabled={submitting}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Reason for Postponement */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Reason for Postponement <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={input.reason}
                onChange={onChangeHandler}
                placeholder="Provide a detailed reason for postponing this hearing..."
                rows={4}
                disabled={submitting}
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none resize-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This reason will be recorded in the hearing's postponement
                history.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex items-center justify-end gap-3 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4">
            <button
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-yellow-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-600"
            >
              {submitting ? (
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
                  Postponing...
                </span>
              ) : (
                "Confirm Postponement"
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
