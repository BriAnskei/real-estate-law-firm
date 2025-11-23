import { X } from "lucide-react";
import React, { useEffect } from "react";
import { CaseType } from "../../../store/Slice/case.slice";
import { ClientFormType } from "../../../store/Slice/client.slice";

interface CaseFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewCase: () => void;
  onCaseChangeInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClientChangeInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  caseInput: CaseType;
  clientInput: ClientFormType;
  setDateForm: React.Dispatch<
    React.SetStateAction<{
      consultationDate: string;
      contultationTime: string;
    }>
  >;
  dateForm: {
    consultationDate: string;
    contultationTime: string;
  };
  loading?: boolean;

  onEditNewCase: () => void;
  submitting: boolean;
  mode: "edit" | "new";
}

export default function CaseFormModal({
  isOpen,
  onClose,
  onSubmitNewCase,
  onCaseChangeInput,
  onClientChangeInput,
  caseInput,
  clientInput,
  setDateForm,
  dateForm,
  submitting,
  loading,
  mode,
  onEditNewCase,
}: CaseFormModalProp) {
  if (!isOpen) return null;

  const hanldeSubmit = () => {
    if (mode === "edit") {
      onEditNewCase();
    } else {
      onSubmitNewCase();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl mx-4 animate-fadeIn">
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl 
     border-2 border-gray-200 dark:border-gray-700 max-h-[90vh]  overflow-y-auto custom-scrollbar"
        >
          {/* Loading Overlay */}
          {(loading || submitting) && (
            <div
              className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 
            rounded-lg z-50 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 border-4 border-gray-200 
                dark:border-gray-700 border-t-[#D4AF37] rounded-full animate-spin"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === "edit"
                    ? `${loading ? "Please wait" : '"Saving update..." '}`
                    : "Adding case..."}
                </p>
              </div>
            </div>
          )}

          {/* Modal Header */}
          <div
            className="sticky top-0 bg-white dark:bg-gray-800 flex 
        items-center justify-between border-b-2 border-gray-200 
        dark:border-gray-700 px-6 py-4 z-10"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {mode === "edit" ? "Update Case" : "Add New Case"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {mode === "edit"
                  ? "Enter consultation case details"
                  : " Enter consultation case details"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg p-2 text-gray-500 transition-all
             hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400
              dark:hover:bg-gray-700 dark:hover:text-gray-300
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-5">
            {/* Concern */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900
             dark:text-white mb-2"
              >
                Case Concern <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="concern"
                value={caseInput.concern}
                onChange={onCaseChangeInput}
                placeholder="Enter case concern"
                disabled={submitting}
                className="w-full rounded-lg border-2 border-gray-200 bg-white
               px-4 py-3 text-sm text-gray-900 transition-all 
               focus:border-[#D4AF37] focus:outline-none dark:border-gray-700
                dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37]
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900
             dark:text-white mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={caseInput.description}
                onChange={onCaseChangeInput}
                placeholder="Enter detailed description of the case"
                disabled={submitting}
                className="w-full rounded-lg border-2 border-gray-200
               bg-white px-4 py-3 text-sm text-gray-900 transition-all
                focus:border-[#D4AF37] focus:outline-none resize-none 
                dark:border-gray-700 dark:bg-gray-900 dark:text-white 
                dark:focus:border-[#D4AF37] disabled:opacity-50 
                disabled:cursor-not-allowed"
              />
            </div>

            {/* Opposing Party */}
            <div>
              <label
                className="block text-sm font-medium text-gray-900
             dark:text-white mb-2"
              >
                Opposing Party
              </label>
              <input
                type="text"
                name="opposing_party"
                value={caseInput.opposing_party || ""}
                onChange={onCaseChangeInput}
                placeholder="Enter opposing party name/details"
                disabled={submitting}
                className="w-full rounded-lg border-2 border-gray-200 bg-white
               px-4 py-3 text-sm text-gray-900 transition-all 
               focus:border-[#D4AF37] focus:outline-none dark:border-gray-700
                dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37]
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Consultation Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-900
               dark:text-white mb-2"
                >
                  Consultation Date
                </label>
                <input
                  type="date"
                  name="consultationDate"
                  value={dateForm.consultationDate}
                  onChange={(e) =>
                    setDateForm((prev) => ({
                      ...prev,
                      consultationDate: e.target.value,
                    }))
                  }
                  disabled={submitting}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white
                 px-4 py-3 text-sm text-gray-900 transition-all 
                 focus:border-[#D4AF37] focus:outline-none dark:border-gray-700
                  dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37]
                  disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-900
               dark:text-white mb-2"
                >
                  Consultation Time
                </label>
                <input
                  type="time"
                  name="consultationTime"
                  value={dateForm.contultationTime}
                  onChange={(e) =>
                    setDateForm((prev) => ({
                      ...prev,
                      contultationTime: e.target.value,
                    }))
                  }
                  disabled={submitting}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white
                 px-4 py-3 text-sm text-gray-900 transition-all 
                 focus:border-[#D4AF37] focus:outline-none dark:border-gray-700
                  dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37]
                  disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

            {/* Client Information */}
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Client Information
              </h4>

              <div className="space-y-4">
                {/* Client Name */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-900
                 dark:text-white mb-2"
                  >
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={clientInput.client_name}
                    onChange={onClientChangeInput}
                    placeholder="Enter client full name"
                    disabled={submitting}
                    className="w-full rounded-lg border-2 border-gray-200 
                  bg-white px-4 py-3 text-sm text-gray-900 transition-all
                   focus:border-[#D4AF37] focus:outline-none 
                   dark:border-gray-700 dark:bg-gray-900 dark:text-white 
                   dark:focus:border-[#D4AF37] disabled:opacity-50 
                   disabled:cursor-not-allowed"
                  />
                </div>

                {/* Contact Number and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-900
                   dark:text-white mb-2"
                    >
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contact_number"
                      value={
                        clientInput.contact_number === null
                          ? ""
                          : String(clientInput.contact_number)
                      }
                      onChange={onClientChangeInput}
                      placeholder="Enter contact number"
                      disabled={submitting}
                      className="w-full rounded-lg border-2 border-gray-200
                     bg-white px-4 py-3 text-sm text-gray-900 transition-all
                      focus:border-[#D4AF37] focus:outline-none
                       dark:border-gray-700 dark:bg-gray-900 dark:text-white
                        dark:focus:border-[#D4AF37] disabled:opacity-50 
                        disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-900
                   dark:text-white mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={clientInput.email}
                      onChange={onClientChangeInput}
                      placeholder="Enter email address"
                      disabled={submitting}
                      className="w-full rounded-lg border-2 border-gray-200
                     bg-white px-4 py-3 text-sm text-gray-900 transition-all
                      focus:border-[#D4AF37] focus:outline-none 
                      dark:border-gray-700 dark:bg-gray-900 dark:text-white
                       dark:focus:border-[#D4AF37] disabled:opacity-50 
                       disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-900
                 dark:text-white mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={clientInput.address}
                    onChange={onClientChangeInput}
                    placeholder="Enter client address"
                    disabled={submitting}
                    className="w-full rounded-lg border-2 border-gray-200
                   bg-white px-4 py-3 text-sm text-gray-900 transition-all
                    focus:border-[#D4AF37] focus:outline-none resize-none
                     dark:border-gray-700 dark:bg-gray-900 dark:text-white
                      dark:focus:border-[#D4AF37] disabled:opacity-50 
                      disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className="sticky bottom-0 bg-white dark:bg-gray-800 flex 
        items-center justify-end gap-3 border-t-2 border-gray-200 
        dark:border-gray-700 px-6 py-4"
          >
            <button
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border-2 border-gray-200 bg-white
             px-5 py-2.5 text-sm font-medium text-gray-700 transition-all
              hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700
               dark:bg-gray-800 dark:text-gray-300 
               dark:hover:border-gray-600 dark:hover:bg-gray-700
               disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={hanldeSubmit}
              disabled={submitting}
              className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium
             text-white transition-all hover:bg-[#C4A037] active:scale-95
             disabled:opacity-50 disabled:cursor-not-allowed 
             disabled:hover:bg-[#D4AF37] flex items-center gap-2"
            >
              {submitting && (
                <div
                  className="w-4 h-4 border-2 border-white/30 
                border-t-white rounded-full animate-spin"
                />
              )}
              {submitting
                ? `${mode === "edit" ? "Updating" : "Adding..."}`
                : `${mode === "edit" ? "Update Case" : "Add Case"}`}
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

  /* Custom Scrollbar Styling - TailAdmin Style */
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
