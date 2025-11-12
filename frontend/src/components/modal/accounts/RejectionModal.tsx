import React from "react";
import { RegistrationType } from "../../../hooks/state/accountRequest/useAccountRequest";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  regiration: RegistrationType;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  regiration,
}) => {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    onConfirm(reason);
    handleClose();
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 
        transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white dark:bg-gray-900 
          rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b
           border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10
               bg-red-100 dark:bg-red-500/20 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-red-500 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-semibold text-gray-800
               dark:text-white/90"
              >
                Reject Registration Request
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 
              dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              You are about to reject the registration request for{" "}
              <span className="font-semibold text-gray-800 dark:text-white/90">
                {regiration.firstName}
              </span>
              . Please provide a reason for this decision.
            </p>

            {/* Reason Textarea */}
            <div className="mb-4">
              <label
                htmlFor="rejection-reason"
                className="block mb-2 text-sm font-medium text-[#D4AF37] dark:text-[#D4AF37]"
              >
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejection-reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
                placeholder="Enter the reason for rejecting this request..."
                rows={4}
                className={`w-full px-4 py-3 text-sm text-gray-700 
                  bg-gray-50 border rounded-lg resize-none focus:outline-none
                   focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent
                    dark:bg-white/[0.05] dark:text-white/90 dark:placeholder-gray-500 
                  transition-all duration-300 ${
                    error
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-200 dark:border-white/[0.1]"
                  }`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Character Counter */}
            <div className="flex justify-end mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {reason.length} characters
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4
           bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl"
          >
            <button
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 
              bg-white border border-gray-300 rounded-lg hover:bg-gray-100 
              dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700
               dark:hover:bg-gray-700 transition-all
                duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400
                 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2.5 text-sm font-medium text-white 
              bg-red-500 rounded-lg hover:bg-red-600 dark:bg-red-500
               dark:hover:bg-red-600 transition-all duration-300 focus:outline-none
                focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                 dark:focus:ring-offset-gray-900"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RejectionModal;
