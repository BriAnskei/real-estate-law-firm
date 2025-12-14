import { Search, Clock } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../ui/table";
import { CaseType } from "../../../store/Slice/case.slice";
import { MarkPaidCaseDetialsType } from "../../../hooks/case/payments/useMarkPaidModal";
import { formatDate } from "../../../util/DateDecoder";

type PaymentsTableProp = {
  byId: Record<string, CaseType>;
  allIds: string[];
  search?: string;
  setSearch: (q: string) => void;
  paymentFilter: string | undefined;
  setPaymentFilter: (p: string) => void;
  loading: boolean;
  clearFilter: () => void;
  markAsPaid: (payload: MarkPaidCaseDetialsType) => void;
};

export default function PaymentsTable({
  byId,
  allIds,
  search,
  setSearch,
  paymentFilter,
  setPaymentFilter,
  loading,
  clearFilter,
  markAsPaid,
}: PaymentsTableProp) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search and Filter */}
      <FilterInput
        search={search ?? ""}
        setSearch={setSearch}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        clearFilter={clearFilter}
      />

      <div className="max-w-full overflow-x-auto">
        <div className="h-[500px] overflow-y-auto custom-scrollbar">
          <Table>
            {/* Table Header */}
            <TableHeaders />

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                // Loading State
                <LoadingRows />
              ) : allIds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-5 py-12 text-center">
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
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        No payments found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {!!search?.length || paymentFilter !== "all"
                          ? "Try adjusting your filters"
                          : "No payment records available"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Data Rows
                allIds.map((id) => (
                  <TableRows
                    key={id}
                    caseItem={byId[id]}
                    markAsPaid={markAsPaid}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function FilterInput({
  search,
  setSearch,
  paymentFilter,
  setPaymentFilter,
  clearFilter,
}: {
  search: string;
  setSearch: (q: string) => void;
  paymentFilter: string | undefined;
  setPaymentFilter: (p: string) => void;
  clearFilter: () => void;
}) {
  return (
    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Search Input - Left */}
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2
               text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            placeholder="Search by concern or client"
            value={search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500 transition-all duration-300"
          />
        </div>

        {/* Payment Filter and Reset Button - Right */}
        <div className="flex items-center gap-3">
          {/* Payment Status Filter Dropdown */}
          <select
            value={paymentFilter ?? "all"}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            className="rounded-lg border-2 border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white/90 cursor-pointer hover:border-gray-300 dark:hover:border-white/[0.2] [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={clearFilter}
            className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-[#D4AF37] hover:bg-gray-50 active:scale-95 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-gray-300 dark:hover:border-[#D4AF37] dark:hover:bg-white/[0.08] whitespace-nowrap"
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
  );
}

function TableHeaders() {
  return (
    <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
      <TableRow>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
        >
          Client Name
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
        >
          Concern
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
        >
          Promise to Pay
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
        >
          Payment Status
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}

function isOverdue(dateString: string): boolean {
  const promiseDate = new Date(dateString);
  const today = new Date();

  // Reset time to compare dates only
  promiseDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return promiseDate <= today;
}

function TableRows({
  caseItem,
  markAsPaid,
}: {
  caseItem: CaseType;
  markAsPaid: (payload: MarkPaidCaseDetialsType) => void;
}) {
  const handlePaymentStatusChange = (newStatus: string) => {
    if (newStatus === "paid" && caseItem.paid === "partial") {
      markAsPaid({
        caseId: caseItem.id!,
        clientName: caseItem.client_name,
        concern: caseItem.concern,
      });
    }
  };

  const getPaymentStatusDisplay = (status: "paid" | "partial" | "no") => {
    const isPaid = status === "paid";
    const isPartial = status === "partial";

    // If paid, show non-editable badge
    if (isPaid) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Paid
        </span>
      );
    }

    // If partial, show dropdown
    if (isPartial) {
      return (
        <select
          value={status}
          onChange={(e) => handlePaymentStatusChange(e.target.value)}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-2 border-yellow-200 dark:border-yellow-800/50 cursor-pointer hover:border-yellow-300 dark:hover:border-yellow-700 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
        >
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      );
    }

    return null;
  };

  const getPromiseToPayDisplay = () => {
    if (caseItem.paid === "paid" || !caseItem.promise_to_pay) {
      return (
        <span className="text-gray-500 dark:text-gray-400 text-sm">N/A</span>
      );
    }

    const overdue = isOverdue(caseItem.promise_to_pay);
    const formattedDate = formatDate(caseItem.promise_to_pay);

    if (overdue) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
          <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-bold text-red-600 dark:text-red-400">
            {formattedDate}
          </span>
        </div>
      );
    }

    return (
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        {formattedDate}
      </span>
    );
  };

  return (
    <TableRow
      key={caseItem.id}
      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
    >
      <TableCell className="px-5 py-4 text-start">
        <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
          {caseItem.client_name}
        </span>
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {caseItem.concern}
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        {getPromiseToPayDisplay()}
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        {getPaymentStatusDisplay(caseItem.paid)}
      </TableCell>
    </TableRow>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-6 w-20 bg-gray-200 dark:bg-white/[0.1] rounded-full animate-pulse"></div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
