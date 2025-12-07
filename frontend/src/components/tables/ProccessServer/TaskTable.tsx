import { Search, Eye } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../ui/table";

import { ProcessServerTask } from "../../../hooks/proccessServer/useProccessServerTask";
import { useNavigate } from "react-router";

export default function TaskTables({
  Tasks,
  formatDate,
  isLoading,

  setQuery,
  query,
  clearFilter,
}: {
  Tasks: ProcessServerTask[];
  formatDate: (dateString: any) => string;
  isLoading: boolean;

  // filter state
  setQuery: (q: string) => void;
  query: string;
  clearFilter: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search and Filter */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Search Input - Left */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, case, or client"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500 transition-all duration-300"
            />
          </div>

          {/* Reset Button - Right */}
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

      <div className="max-w-full overflow-x-auto">
        <div className="h-[500px] overflow-y-auto custom-scrollbar">
          <Table>
            {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
                >
                  Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
                >
                  Case
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
                  Assigner
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
                >
                  Due Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#D4AF37] text-center text-xs dark:text-[#D4AF37]"
                >
                  View
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                // Loading State
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="h-4 w-28 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="h-4 w-36 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-white/[0.1] rounded mx-auto animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : Tasks.length === 0 ? (
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        No tasks found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {false
                          ? "Try adjusting your search"
                          : "No tasks have been assigned yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Data Rows
                Tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                        {task.title}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      {task.case_concern}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      {task.client_name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      {task.assigner_name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      {formatDate(task.due_date)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <button
                        onClick={() => navigate("proccess_server/view/task")}
                        className="inline-flex items-center justify-center w-8 h-8 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37] dark:text-[#D4AF37] dark:hover:text-white dark:hover:bg-[#D4AF37] rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        aria-label="View task details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
