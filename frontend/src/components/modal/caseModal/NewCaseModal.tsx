import { X } from "lucide-react";
import React, { useEffect } from "react";
import { CaseType } from "../../../store/Slice/case.slice";
import { ClientType } from "../../../store/Slice/client.slice";

interface AddCaseModalProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onCaseChangeInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClientChangeInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  caseInput: CaseType;
  clientInput: ClientType;
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
  loading: boolean;
}

export default function AddCaseModal({
  isOpen,
  onClose,
  onSubmit,
  onCaseChangeInput,
  onClientChangeInput,
  caseInput,
  clientInput,
  setDateForm,
  dateForm,
  loading,
}: AddCaseModalProp) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
     bg-black/50 p-4"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800
       rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Loading Overlay */}
        {loading && (
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
                Adding case...
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
              Add New Case
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter consultation case details
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              className="w-full rounded-lg border-2 border-gray-200
               bg-white px-4 py-3 text-sm text-gray-900 transition-all
                focus:border-[#D4AF37] focus:outline-none resize-none 
                dark:border-gray-700 dark:bg-gray-900 dark:text-white 
                dark:focus:border-[#D4AF37] disabled:opacity-50 
                disabled:cursor-not-allowed"
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
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
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
            disabled={loading}
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
            onClick={onSubmit}
            disabled={loading}
            className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium
             text-white transition-all hover:bg-[#C4A037] active:scale-95
             disabled:opacity-50 disabled:cursor-not-allowed 
             disabled:hover:bg-[#D4AF37] flex items-center gap-2"
          >
            {loading && (
              <div
                className="w-4 h-4 border-2 border-white/30 
                border-t-white rounded-full animate-spin"
              />
            )}
            {loading ? "Adding..." : "Add Case"}
          </button>
        </div>
      </div>
    </div>
  );
}
