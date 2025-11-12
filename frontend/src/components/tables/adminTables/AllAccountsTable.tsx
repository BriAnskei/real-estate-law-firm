import { useUsers } from "../../../hooks/state/user/useUsers";

import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../ui/table";

const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    lawyer: "Lawyer",
    paralegal: "Paralegal",
    "process-server": "Process Server",
  };
  return roleMap[role] || role;
};

export default function AllAccountsTable() {
  const {
    loading,
    byId,
    allIds,
    search,
    handleOnFilterChange,
    clearFilter,
    onFilter,
  } = useUsers();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search Filter */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={handleOnFilterChange}
              className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {onFilter && (
            <button
              onClick={clearFilter}
              disabled={loading}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:hover:bg-white/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 mr-1.5"
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
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
              >
                Role
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading
              ? // Loading State
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              : allIds.map((id) => {
                  const useData = byId[id];

                  return (
                    <TableRow
                      key={useData.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                          {useData.firstName} {useData.lastName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                        {useData.email}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                        {formatRole(useData.role)}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
