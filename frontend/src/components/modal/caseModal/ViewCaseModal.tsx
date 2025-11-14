import { X } from "lucide-react";
import { useState } from "react";
import { CaseType } from "../../../store/Slice/case.slice";
import {
  dateDisplay,
  isTodayOrWithin3Days,
} from "../../../hooks/case/useConsultCases";

type ViewCaseModalProp = {
  isOpen: boolean;
  onClose: () => void;
  caseData: CaseType;
  onConfirm: (data: any) => void;
};

export function ViewCaseModal({
  isOpen,
  onClose,
  caseData,
  onConfirm,
}: ViewCaseModalProp) {
  const [paymentType, setPaymentType] = useState("");
  const [promiseToPayDate, setPromiseToPayDate] = useState("");

  if (!isOpen || !caseData) return null;

  const handleConfirm = () => {
    if (!paymentType) {
      alert("Please select a payment type");
      return;
    }

    if (paymentType === "partial" && !promiseToPayDate) {
      alert("Please select a promise to pay date for partial payment");
      return;
    }

    onConfirm({
      caseId: caseData.id,
      paymentType,
      ...(paymentType === "partial" && { promiseToPayDate }),
      status: "ongoing",
    });

    setPaymentType("");
    setPromiseToPayDate("");
  };

  const handleClose = () => {
    setPaymentType("");
    setPromiseToPayDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Case Details
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Review and process consultation case
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Case Information */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Concern
            </label>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
              {caseData.concern}
            </p>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Description
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              {caseData.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Client Name
              </label>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                {caseData.client_name}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Date Filed
              </label>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                {new Date(caseData.created_at!).toLocaleString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Consultation Date/Time
            </label>
            <p
              className={`text-sm font-bold ${
                isTodayOrWithin3Days(new Date(caseData.consultation_date!))
                  ? "text-orange-400"
                  : "text-gray-900 dark:text-white"
              } mt-1`}
            >
              {dateDisplay(new Date(caseData.consultation_date!)) ||
                "Not scheduled"}
            </p>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

          {/* Payment Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37]"
            >
              <option value="">Select payment type</option>
              <option value="paid">Paid in Full</option>
              <option value="partial">Partial Payment</option>
            </select>
          </div>

          {/* Promise to Pay Date (only shown for partial payment) */}
          {paymentType === "partial" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Promise to Pay Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={promiseToPayDate}
                onChange={(e) => setPromiseToPayDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-[#D4AF37]"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Select the date when the remaining payment is expected
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95"
          >
            Confirm & Move to Ongoing
          </button>
        </div>
      </div>
    </div>
  );
}
