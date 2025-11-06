import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface RegistrationRequest {
  id: string;
  uid?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "lawyer" | "paralegal" | "process-server";
  provider: "manual" | "google";
}

// Mock data for registration requests
const registrationRequests: RegistrationRequest[] = [
  {
    id: "1",
    email: "john.martinez@lawfirm.com",
    firstName: "John",
    lastName: "Martinez",
    role: "lawyer",
    provider: "manual",
  },
  {
    id: "2",
    email: "sarah.thompson@legal.com",
    firstName: "Sarah",
    lastName: "Thompson",
    role: "paralegal",
    provider: "google",
  },
  {
    id: "3",
    email: "michael.chen@court.gov",
    firstName: "Michael",
    lastName: "Chen",
    role: "process-server",
    provider: "manual",
  },
  {
    id: "4",
    email: "emily.rodriguez@lawgroup.com",
    firstName: "Emily",
    lastName: "Rodriguez",
    role: "lawyer",
    provider: "manual",
  },
  {
    id: "5",
    email: "david.wilson@legal.com",
    firstName: "David",
    lastName: "Wilson",
    role: "paralegal",
    provider: "google",
  },
];

// Helper function to format role names
const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    lawyer: "Lawyer",
    paralegal: "Paralegal",
    "process-server": "Process Server",
  };
  return roleMap[role] || role;
};

export default function RegistrationRequestsTable({
  openRejectionModal,
}: {
  openRejectionModal: (name: string) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleApprove = (id: string, name: string) => {
    console.log(`Approved request for ${name} (ID: ${id})`);
    // TODO: Implement approval logic
    // After approval, this request will be removed from the table
  };

  const handleReject = (id: string, name: string) => {
    console.log(`Rejected request for ${name} (ID: ${id})`);

    openRejectionModal(name);
    // TODO: Implement rejection logic
    // After rejection, this request will be removed from the table
  };

  // Filter requests based on search query
  const filteredRequests = registrationRequests.filter((request) => {
    const fullName = `${request.firstName} ${request.lastName}`.toLowerCase();
    const email = request.email.toLowerCase();
    const role = formatRole(request.role).toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) || email.includes(query) || role.includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search Filter */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500 transition-all duration-300"
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:hover:bg-white/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
                className="px-5 py-3 font-medium text-[#D4AF37] text-start text-theme-xs dark:text-[#D4AF37]"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-[#D4AF37] text-start text-theme-xs dark:text-[#D4AF37]"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-[#D4AF37] text-start text-theme-xs dark:text-[#D4AF37]"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-[#D4AF37] text-center text-theme-xs dark:text-[#D4AF37]"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg
                      className="w-12 h-12 text-gray-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">
                      No registration requests found matching "{searchQuery}"
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {request.firstName} {request.lastName}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {request.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatRole(request.role)}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          handleApprove(
                            request.id,
                            `${request.firstName} ${request.lastName}`
                          )
                        }
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-[#D4AF37] rounded-lg hover:bg-[#C19B2F] dark:bg-[#D4AF37] dark:hover:bg-[#C19B2F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleReject(
                            request.id,
                            `${request.firstName} ${request.lastName}`
                          )
                        }
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
                        Reject
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
