import { Trash2 } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "../../ui/table";
import { ClientType } from "../../../store/Slice/client.slice";

type ClientsTableProp = {
  byId: Record<string, ClientType>;
  allIds: string[];
  search?: string;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
  openDeleteModal: (payload: { id: string; name: string }) => void;
  clearFilter: () => void;
  isActionEnable?: boolean;
};

export default function ClientsTable({
  byId,
  allIds,
  search,
  setSearch,
  loading,
  openDeleteModal,
  clearFilter,
  isActionEnable,
}: ClientsTableProp) {
  const formatPhoneNumber = (phone: number): string => {
    const phoneStr = phone.toString();
    return `+63 ${phoneStr.slice(0, 3)} ${phoneStr.slice(
      3,
      6
    )} ${phoneStr.slice(6)}`;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search Filter */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by name"
              value={search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500 transition-all duration-300"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {search && (
            <button
              onClick={clearFilter}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:hover:bg-white/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        <div className="h-[500px] overflow-y-auto custom-scrollbar">
          <Table>
            {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
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
                  Contact
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
                >
                  Address
                </TableCell>
                {isActionEnable && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#D4AF37] text-center text-xs dark:text-[#D4AF37]"
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                // Loading State
                Array.from({ length: 7 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="h-4 w-40 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-white/[0.1] rounded mx-auto animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        No clients found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {!!search?.length
                          ? "Try adjusting your search terms"
                          : "No clients have been added yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Data Rows
                allIds.map((id) => {
                  const client = byId[id];

                  return (
                    <TableRow
                      key={client.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                          {client.client_name}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                        {client.email}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                        {formatPhoneNumber(client.contact_number!)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
                        {client.address}
                      </TableCell>
                      {isActionEnable && (
                        <TableCell className="px-5 py-4 text-center">
                          <button
                            onClick={() =>
                              openDeleteModal({
                                id: client.id,
                                name: client.client_name,
                              })
                            }
                            className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            aria-label="Delete client"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
