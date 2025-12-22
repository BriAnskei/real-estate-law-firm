import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import { FilterType, useUserLogs } from "../../hooks/state/useLogs/useUserLogs";
import { SessionLogType } from "../../types/user_sessionType";
import { formatDateTime } from "../../util/DateDecoder";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Helper function to calculate duration
const calculateDuration = (login: string, logout: string | null) => {
  if (!logout) return "Active";

  const loginDate = new Date(login);
  const logoutDate = new Date(logout);

  const diff = logoutDate.getTime() - loginDate.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Helper function to format role
const formatRole = (role: string) => {
  return role
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function SessionLogs() {
  const {
    loading,
    usersSessions,
    page,
    totalPage,
    total,
    onFilterChange,
    filter,
    handlePageChange,
    clearFilter,
    onfiltered,
  } = useUserLogs();

  const itemsPerPage = 10;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, total);

  return (
    <>
      <PageMeta title="User Sessions" description="View All user sessions" />
      <PageBreadcrumb pageTitle="Session" />
      <div className="space-y-6">
        <ComponentCard title="All Seesions">
          <SessionLogsTable
            onFilterChange={onFilterChange}
            filter={filter}
            logs={usersSessions}
            clearFilters={clearFilter}
            currentPage={page}
            setCurrentPage={handlePageChange}
            totalPages={totalPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalFiltered={total}
            loading={loading}
            onfiltered={onfiltered}
          />
        </ComponentCard>
      </div>
    </>
  );
}

type SessionLogsTableProps = {
  logs: SessionLogType[];

  onfiltered: boolean;

  clearFilters: () => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalFiltered: number;
  loading: boolean;

  onFilterChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  filter: FilterType;
};

function SessionLogsTable({
  logs,
  onfiltered,
  clearFilters,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  totalFiltered,
  loading,

  onFilterChange,
  filter,
}: SessionLogsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search and Filter */}
      <FilterInput
        onFilterChange={onFilterChange}
        filter={filter}
        clearFilters={clearFilters}
      />

      <div className="max-w-full overflow-x-auto">
        <div className="h-[500px] overflow-y-auto custom-scrollbar">
          <Table>
            {/* Table Header */}
            <TableHeaders />

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <LoadingRows />
              ) : logs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-12 text-center">
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
                        No session logs found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {onfiltered
                          ? "Try adjusting your filters"
                          : "No session logs available at this time"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((log) => <TableRows key={log.id} log={log} />)
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && logs?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalFiltered={totalFiltered}
        />
      )}
    </div>
  );
}

function FilterInput({
  onFilterChange,
  filter,
  clearFilters,
}: {
  onFilterChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  filter: FilterType;
  clearFilters: () => void;
}) {
  return (
    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Search Input - Left */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            name="query"
            value={filter.query}
            onChange={onFilterChange}
            className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500 transition-all duration-300"
          />
        </div>

        {/* Date Filters and Reset Button - Right */}
        <div className="flex items-center gap-3">
          {/* Date From */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={onFilterChange}
              className="rounded-lg border-2 border-gray-200 bg-white py-2 px-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white/90 cursor-pointer hover:border-gray-300 dark:hover:border-white/[0.2]"
            />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              to
            </span>
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={onFilterChange}
              className="rounded-lg border-2 border-gray-200 bg-white py-2 px-3 text-sm text-gray-900 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white/90 cursor-pointer hover:border-gray-300 dark:hover:border-white/[0.2]"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#D4AF37] hover:bg-gray-50 active:scale-95 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-gray-300 dark:hover:border-[#D4AF37] dark:hover:bg-white/[0.08] whitespace-nowrap"
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
    <thead className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
      <tr>
        <th className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]">
          User
        </th>
        <th className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]">
          Role
        </th>
        <th className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]">
          Login Time
        </th>
        <th className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]">
          Logout Time
        </th>
        <th className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]">
          Duration
        </th>
        <th className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]">
          Status
        </th>
      </tr>
    </thead>
  );
}

function TableRows({ log }: { log: SessionLogType }) {
  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
      <TableCell className="px-5 py-4 text-start">
        <div className="flex flex-col">
          <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
            {log.fullName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {log.email}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {formatRole(log.role)}
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {formatDateTime(log.loginTime)}
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {log.logoutTime ? formatDateTime(log.logoutTime) : "—"}
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {calculateDuration(log.loginTime, log.logoutTime)}
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <span
          className={`text-sm font-medium ${
            log.status === "active"
              ? "text-green-700 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
        </span>
      </TableCell>
    </TableRow>
  );
}

function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  totalFiltered,
}: {
  currentPage: number;
  setCurrentPage: (v: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalFiltered: number;
}) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.05] px-5 py-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {startIndex + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {Math.min(endIndex, totalFiltered)}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {totalFiltered}
        </span>{" "}
        results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#D4AF37] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-gray-300 dark:hover:border-[#D4AF37] dark:hover:bg-white/[0.08]"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-[#D4AF37] text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#D4AF37] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-gray-300 dark:hover:border-[#D4AF37] dark:hover:bg-white/[0.08]"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="px-5 py-4 text-start">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
              <div className="h-3 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
            </div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-36 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-36 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-16 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-20 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
