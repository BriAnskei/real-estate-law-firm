import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Search,
  Edit2,
  Trash2,
} from "lucide-react";
import AddCaseModal from "../../components/modal/caseModal/NewCaseModal";
import { ViewCaseModal } from "../../components/modal/caseModal/ViewCaseModal";
import useConsultationCases, {
  dateDisplay,
  isTodayOrWithin3Days,
} from "../../hooks/case/useConsultCases";

// Main Consultation Page Component
export default function ConsultationPage() {
  const { viewCaseModalState, addNewCaseModalState, allIds, byId, totalPages } =
    useConsultationCases();

  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const cardsToShow = 4;

  const handleNext = () => {
    if (scrollPosition + cardsToShow < allIds.length) {
      setScrollPosition(scrollPosition + cardsToShow);
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setScrollPosition(0);
    }
  };

  const handlePrevious = () => {
    if (scrollPosition > 0) {
      setScrollPosition(Math.max(0, scrollPosition - cardsToShow));
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setScrollPosition(0);
    }
  };

  const handleEdit = (caseData: any) => {
    // Add your edit logic here
    console.log("Edit case:", caseData);
  };

  const handleDelete = (caseData: any) => {
    // Add your delete logic here
    if (
      window.confirm(
        `Are you sure you want to delete the case "${caseData.concern}"?`
      )
    ) {
      console.log("Delete case:", caseData);
    }
  };

  const visibleCasesIds = allIds.slice(
    scrollPosition,
    scrollPosition + cardsToShow
  );

  const canGoPrevious = currentPage > 1 || scrollPosition > 0;
  const canGoNext =
    currentPage < totalPages || scrollPosition + cardsToShow < allIds.length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb and Add Button Row */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Consultation Cases
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and review consultation cases
            </p>
          </div>
          <button
            onClick={addNewCaseModalState.openAddNewCaseModal}
            className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add New Case
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by concern, description, or client name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setScrollPosition(0);
              }}
              className="w-full rounded-lg border-2 border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-[#D4AF37] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="rounded-lg border-2 border-gray-200 bg-white px-6 py-8 dark:border-gray-700 dark:bg-gray-800 xl:px-10 xl:py-12">
          {/* Cards Container */}
          <div className="mx-auto max-w-7xl">
            {allIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No cases found
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleCasesIds &&
                    visibleCasesIds.map((id, index) => {
                      const caseData = byId[id];
                      return (
                        <div
                          key={id}
                          className="group relative flex h-full flex-col rounded-lg border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#D4AF37]"
                          style={{
                            animation: `fadeIn 0.3s ease-out ${
                              index * 0.1
                            }s both`,
                          }}
                        >
                          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => handleEdit(caseData)}
                              className="rounded-md bg-gray-100 dark:bg-inherit p-1.5 text-gray-600 dark:text-gray-400 transition-all hover:text-blue-500 dark:hover:text-blue-400 active:scale-95"
                              title="Edit case"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(caseData)}
                              className="rounded-md bg-gray-100 dark:bg-inherit p-1.5 text-gray-600 dark:text-gray-400 transition-all hover:text-red-500 dark:hover:text-red-400 active:scale-95"
                              title="Delete case"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Concern Title */}
                          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white pr-16">
                            {caseData.concern}
                          </h3>

                          {/* Gold Accent Line */}
                          <div className="h-px w-12 bg-[#D4AF37] mb-4"></div>

                          {/* Description */}
                          <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            {caseData.description}
                          </p>

                          {/* Client Info */}
                          <div className="mb-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Client
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {caseData.client_name}
                            </p>
                          </div>

                          {/* Date and Button */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <span
                              className={`text-xs ${
                                isTodayOrWithin3Days(
                                  new Date(caseData.consultation_date!)
                                )
                                  ? "text-orange-400 font-semibold"
                                  : "text-gray-600 dark:text-gray-400"
                              } font-medium`}
                            >
                              {dateDisplay(
                                new Date(caseData.consultation_date!)
                              )}
                            </span>
                            <button
                              onClick={() =>
                                viewCaseModalState.openViewConsultCaseModal(
                                  caseData
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Pagination Controls */}
                <div className="mt-10 flex flex-col items-center gap-6">
                  {/* Page Indicators */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          setScrollPosition(0);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          currentPage === i + 1
                            ? "w-8 bg-[#D4AF37]"
                            : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                        }`}
                        aria-label={`Go to page ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePrevious}
                      disabled={!canGoPrevious}
                      className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-[#D4AF37] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[#D4AF37] dark:hover:bg-gray-700 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={handleNext}
                      disabled={!canGoNext}
                      className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#C4A037] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#D4AF37]"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewCaseModal
        isOpen={viewCaseModalState.isViewConsultCaseModalOpen}
        onClose={viewCaseModalState.closeViewConsultCaseModal}
        caseData={viewCaseModalState.selectedCase}
        onConfirm={viewCaseModalState.confirmCase}
      />

      <AddCaseModal
        loading={addNewCaseModalState.addLoading}
        isOpen={addNewCaseModalState.isAddNewCaseModal}
        onClose={addNewCaseModalState.closeAddNewCaseModal}
        onSubmit={addNewCaseModalState.onSubmit}
        onCaseChangeInput={addNewCaseModalState.onCaseChangeInput}
        onClientChangeInput={addNewCaseModalState.onClientChangeInput}
        caseInput={addNewCaseModalState.newCaseInput}
        clientInput={addNewCaseModalState.newClientInput}
        setDateForm={addNewCaseModalState.setDateForm}
        dateForm={addNewCaseModalState.dateForm}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
