import { Eye, Search, Trash2 } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../ui/table";
import { CaseType } from "../../../store/Slice/case.slice";
import { useNavigate } from "react-router";

import { filterType } from "../../../hooks/case/ongoing/useCase";

type CasesTableProp = {
  byId: Record<string, CaseType>;
  allIds: string[];
  search?: string;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  statusFilter: filterType;
  setStatusFilter: React.Dispatch<React.SetStateAction<filterType>>;
  loading: boolean;

  deleteCase: (caseData: { caseId: string; concern: string }) => void;
  clearFilter: () => void;
};

export default function CasesTable({
  byId,
  allIds,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  loading,

  deleteCase,
  clearFilter,
}: CasesTableProp) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search and Filter */}
      <FilterInput
        search={search ?? ""}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
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
                  <TableCell colSpan={5} className="px-5 py-12 text-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        No cases found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {!!search?.length || statusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "No cases have been filed yet"}
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
                    deleteCase={deleteCase}
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
  statusFilter,
  setStatusFilter,
  clearFilter,
}: {
  search: string;
  setSearch: any;
  statusFilter: filterType;
  setStatusFilter: React.Dispatch<React.SetStateAction<filterType>>;
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

        {/* Status Filter and Reset Button - Right */}
        <div className="flex items-center gap-3">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border-2 border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white/90 cursor-pointer hover:border-gray-300 dark:hover:border-white/[0.2] [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
          >
            <option value="all">All Cases</option>
            <option value="ongoing">Ongoing</option>
            <option value="complete">Completed</option>
          </select>

          {/* Reset Button - Always Visible */}
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
          Concern
        </TableCell>
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
          Date Filed
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
        >
          Status
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-[#D4AF37] text-center text-xs dark:text-[#D4AF37]"
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}

function TableRows({
  caseItem,

  deleteCase,
}: {
  caseItem: CaseType;

  deleteCase: (caseData: { caseId: string; concern: string }) => void;
}) {
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const isOngoing = status.toLowerCase() === "ongoing";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          isOngoing
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        }`}
      >
        {isOngoing ? "Ongoing" : "Completed"}
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
          {caseItem.concern}
        </span>
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {caseItem.client_name}
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {formatDate(caseItem.created_at!)}
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        {getStatusBadge(caseItem.status || "ongoing")}
      </TableCell>
      <TableCell className="px-5 py-4 text-center">
        <div className="inline-flex items-center gap-2">
          {/* View Button */}
          <button
            onClick={() =>
              navigate(`/case/transaction/${caseItem.id}`, { replace: true })
            }
            className="inline-flex items-center justify-center w-8 h-8 
            text-[#D4AF37] hover:text-white hover:bg-[#D4AF37] 
            dark:text-[#D4AF37] dark:hover:text-white dark:hover:bg-[#D4AF37]
             rounded-lg transition-all duration-300 focus:outline-none focus:ring-2
              focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="View case progress"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() =>
              deleteCase({
                caseId: caseItem.id!,
                concern: caseItem.concern,
              })
            }
            className="inline-flex items-center justify-center w-8 h-8
             text-red-600 hover:text-white hover:bg-red-600 
             dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500
              rounded-lg transition-all duration-300 focus:outline-none focus:ring-2
               focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Delete case"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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
            <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-6 w-20 bg-gray-200 dark:bg-white/[0.1] rounded-full animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-center">
            <div className="h-8 w-24 bg-gray-200 dark:bg-white/[0.1] rounded mx-auto animate-pulse"></div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
