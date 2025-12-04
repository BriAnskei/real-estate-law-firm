import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import HearingScheduleModal from "../../components/modal/caseModal/HearingScheduleModal";
import {
  TableRow,
  TableCell,
  TableHeader,
  Table,
  TableBody,
} from "../../components/ui/table";

import { HearingType } from "../../types/HearingTypes";
import CaseTransactionLoader from "../../components/ui/loading/CaseTransactionLoader";
import { HearingInputType } from "../../hooks/case/ongoing/useHearingScheduleModal";
import { formatDateToDateInputString } from "../../util/DateDecoder";
import useCaseHearingPage from "../../hooks/case/ongoing/useHearing";
import { DeleteModal } from "../../components/modal/caseModal/DeleteModal";

// Mock data types
type HearingStatus = "scheduled" | "postponed" | "completed" | "cancelled";

export default function HearingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    hearingDeleteModal,
    hearingFormModal,

    hearings,
    caseConcern,
    caseFiledAt,
    clientName,

    loading,
  } = useCaseHearingPage();

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | HearingStatus>(
    "all"
  );
  const [loadingTable] = useState(false);

  // // Filter hearings
  // const filteredHearings = useMemo(() => {
  //   return (hearings ?? []).filter((hearing) => {
  //     const matchesSearch = hearing.type
  //       .toLowerCase()
  //       .includes(search.toLowerCase());
  //     const matchesStatus =
  //       statusFilter === "all" || hearing.status === statusFilter;
  //     return matchesSearch && matchesStatus;
  //   });
  // }, [hearings, search, statusFilter]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const clearFilter = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const handleAddHearing = () => {
    console.log("Add hearing clicked");
    // Will be implemented later
  };

  const handleEditHearing = (hearingId: string) => {
    console.log("Edit hearing:", hearingId);
    // Will be implemented later
  };

  const handleDeleteHearing = (hearingId: string, title: string) => {
    console.log("Delete hearing:", hearingId, title);
    // Will be implemented later
  };

  const handleStatusChange = (hearingId: string, newStatus: HearingStatus) => {
    console.log("Status change:", hearingId, newStatus);
    if (newStatus === "postponed") {
      console.log("Open postponement modal");
      // Will open modal later
    }
  };

  const handleViewHistory = (hearingId: string) => {
    console.log("View postponement history:", hearingId);
    // Will be implemented later
  };

  if (loading) {
    return (
      <CaseTransactionLoader
        isLoading={loading}
        loadingText="Initializing Case Hearings"
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() =>
                navigate(`/case/transaction/${id}`, { replace: true })
              }
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
              hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Case</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Hearing Schedule
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {caseConcern}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Client: {clientName} • Filed on {formatDate(caseFiledAt!)}
                </p>
              </div>

              <button
                onClick={() => hearingFormModal.openNewSchedModal()}
                className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-5 py-2.5 
                text-sm font-medium text-white transition-all hover:bg-[#C4A037] 
                active:scale-95 shadow-sm whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Add Schedule
              </button>
            </div>
          </div>

          {/* Hearings Table */}
          <HearingsTable
            hearings={hearings ?? []}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            loading={loadingTable}
            clearFilter={clearFilter}
            formatDateTime={formatDateTime}
            onEditHearing={hearingFormModal.openNewSchedModal}
            onDeleteHearing={hearingDeleteModal.open}
            onStatusChange={handleStatusChange}
            onViewHistory={handleViewHistory}
          />
        </div>
      </div>

      <HearingScheduleModal
        submitting={hearingFormModal.isSubmitting}
        isOpen={hearingFormModal.isOpen}
        onClose={hearingFormModal.closeNewSchedModal}
        onSubmit={hearingFormModal.handleSubmit}
        onChangeHanlder={hearingFormModal.onChangeHanlder}
        input={hearingFormModal.input}
        mode={hearingFormModal.mode}
      />

      <DeleteModal
        title="Delete Hearing Schedule"
        itemLabel="Hearing Type"
        description="Are you sure you want to delete this hearing?"
        isDeleting={hearingDeleteModal.isDeleting}
        itemName={hearingDeleteModal.hearingType}
        isOpen={hearingDeleteModal.isOpen}
        onClose={hearingDeleteModal.close}
        onConfirm={hearingDeleteModal.confirm}
      />
    </>
  );
}

// Hearings Table Component
function HearingsTable({
  hearings,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  loading,
  clearFilter,
  formatDateTime,
  onEditHearing,
  onDeleteHearing,
  onStatusChange,
  onViewHistory,
}: {
  hearings: HearingType[];
  search: string;
  setSearch: (value: string) => void;
  statusFilter: "all" | HearingStatus;
  setStatusFilter: (value: "all" | HearingStatus) => void;
  loading: boolean;
  clearFilter: () => void;
  formatDateTime: (date: string) => string;
  onEditHearing: (payload: HearingInputType) => void;
  onDeleteHearing: (payload: { id: string; hearingType: string }) => void;
  onStatusChange: (id: string, status: HearingStatus) => void;
  onViewHistory: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search and Filter */}
      <FilterSection
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilter={clearFilter}
      />

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
                  Hearing Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#D4AF37] text-start text-xs dark:text-[#D4AF37]"
                >
                  Schedule
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

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <LoadingRows />
              ) : hearings.length === 0 ? (
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        No hearings found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {search || statusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "No hearings have been scheduled yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                hearings.map((hearing) => (
                  <HearingRow
                    key={hearing.id}
                    hearing={hearing}
                    formatDateTime={formatDateTime}
                    onEdit={onEditHearing}
                    onDelete={onDeleteHearing}
                    onStatusChange={onStatusChange}
                    onViewHistory={onViewHistory}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C4A037;
        }
      `}</style>
    </div>
  );
}

// Filter Section
function FilterSection({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  clearFilter,
}: {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: "all" | HearingStatus;
  setStatusFilter: (value: "all" | HearingStatus) => void;
  clearFilter: () => void;
}) {
  return (
    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by hearing title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 
              rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent 
              dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/90 dark:placeholder-gray-500 
              transition-all duration-300"
          />
        </div>

        {/* Status Filter and Reset */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border-2 border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-900 
              transition-all focus:border-[#D4AF37] focus:outline-none dark:border-white/[0.1] 
              dark:bg-white/[0.05] dark:text-white/90 cursor-pointer hover:border-gray-300 
              dark:hover:border-white/[0.2] [&>option]:bg-white [&>option]:text-gray-900 
              dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
          >
            <option value="all">All Hearings</option>
            <option value="scheduled">Scheduled</option>
            <option value="postponed">Postponed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={clearFilter}
            className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 
              text-sm font-medium text-gray-700 transition-all hover:border-[#D4AF37] hover:bg-gray-50 
              active:scale-95 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-gray-300 
              dark:hover:border-[#D4AF37] dark:hover:bg-white/[0.08] whitespace-nowrap"
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

// Hearing Row Component
function HearingRow({
  hearing,
  formatDateTime,
  onEdit,
  onDelete,
  onStatusChange,
  onViewHistory,
}: {
  hearing: HearingType;
  formatDateTime: (date: string) => string;
  onEdit: (payload: HearingInputType) => void;
  onDelete: (payload: { id: string; hearingType: string }) => void;
  onStatusChange: (id: string, status: HearingStatus) => void;
  onViewHistory: (id: string) => void;
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const getStatusBadge = (status: HearingStatus) => {
    const styles = {
      scheduled:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      postponed:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
      <div className="relative">
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
            ${styles[status]} hover:opacity-80 transition-opacity`}
        >
          <span className="capitalize">{status}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {showStatusDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowStatusDropdown(false)}
            />
            <div
              className="absolute left-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
              border border-gray-200 dark:border-gray-700 z-20 overflow-hidden"
            >
              {(
                [
                  "scheduled",
                  "postponed",
                  "completed",
                  "cancelled",
                ] as HearingStatus[]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onStatusChange(hearing.id!, s);
                    setShowStatusDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors capitalize"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
      <TableCell className="px-5 py-4 text-start">
        <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
          {hearing.type}
        </span>
      </TableCell>
      <TableCell className="px-5 py-4 text-gray-500 text-start text-sm dark:text-gray-400">
        {formatDateTime(hearing.scheduled_date)}
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        {getStatusBadge(hearing.status!)}
      </TableCell>
      <TableCell className="px-5 py-4 text-center">
        <div className="inline-flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={() => {
              const { formattedDate, formattedTime } =
                formatDateToDateInputString(hearing.scheduled_date);

              onEdit({
                id: hearing.id,
                type: hearing.type,
                date: formattedDate,
                time: formattedTime,
              });
            }}
            className="inline-flex items-center justify-center w-8 h-8 
              text-[#D4AF37] hover:text-white hover:bg-[#D4AF37] 
              dark:text-[#D4AF37] dark:hover:text-white dark:hover:bg-[#D4AF37]
              rounded-lg transition-all duration-300 focus:outline-none focus:ring-2
              focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Edit hearing"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* View History Button - Only show if has postponement history */}

          <button
            onClick={() => onViewHistory(hearing.id!)}
            className="inline-flex items-center justify-center w-8 h-8 
                text-blue-600 hover:text-white hover:bg-blue-600 
                dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500
                rounded-lg transition-all duration-300 focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="View postponement history"
            title="View postponement history"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() =>
              onDelete({ id: hearing.id!, hearingType: hearing.type })
            }
            className="inline-flex items-center justify-center w-8 h-8
              text-red-600 hover:text-white hover:bg-red-600 
              dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500
              rounded-lg transition-all duration-300 focus:outline-none focus:ring-2
              focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Delete hearing"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Loading Rows Component
function LoadingRows() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-48 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-4 w-40 bg-gray-200 dark:bg-white/[0.1] rounded animate-pulse" />
          </TableCell>
          <TableCell className="px-5 py-4 text-start">
            <div className="h-6 w-24 bg-gray-200 dark:bg-white/[0.1] rounded-full animate-pulse" />
          </TableCell>
          <TableCell className="px-5 py-4 text-center">
            <div className="h-8 w-24 bg-gray-200 dark:bg-white/[0.1] rounded mx-auto animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
