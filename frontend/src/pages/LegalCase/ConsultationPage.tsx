import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  Loader2,
  MessageSquareOff,
} from "lucide-react";
import AddCaseModal from "../../components/modal/caseModal/CaseFormModal";
import { ViewCaseModal } from "../../components/modal/caseModal/ViewCaseModal";
import useConsultationCases, {
  dateDisplay,
  isTodayOrWithin3Days,
} from "../../hooks/case/useConsultCases";
import { DeleteCaseModal } from "../../components/modal/caseModal/deleteCaseModal";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/selector/user/userSelector";
import { Roles } from "../../store/Slice/userSlice";

// Main Consultation Page Component
export default function ConsultationPage() {
  const user = useSelector(selectCurrentUser);

  const {
    viewCaseModalState,
    caseFormModal,
    displayData,
    setSearch,
    search,
    setSortFilter,
    handleResetFilters,
    totalPages,
    loadMore,
    onFiltered,
    filterLoading,
    deleteCaseModal,
    sortFilter,
  } = useConsultationCases();

  const { byId, allIds } = displayData;

  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  const cardsToShow = 4;
  const cardsPerServerPage = 12;

  const hasMore = currentPage < totalPages;
  const visualPage = Math.floor(scrollPosition / cardsPerServerPage) + 1;

  const handleNext = () => {
    if (scrollPosition + cardsToShow < allIds.length) {
      setScrollPosition(scrollPosition + cardsToShow);
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setScrollPosition(scrollPosition + cardsToShow);

      // fetch more cards
      const nextPage = currentPage + 1;
      loadMore(nextPage);
    }
  };

  const handlePrevious = () => {
    if (scrollPosition > 0) {
      setScrollPosition(scrollPosition - cardsToShow);
    }
  };

  const hanldeSortBy = (sortBy: string) => {
    if (sortBy === "consultation_date") {
      setSortFilter(sortBy);
      setScrollPosition(0);
    } else {
      console.log("reseting filter");
      // reset filter by default(created_at)
      setSortFilter(undefined);
    }
  };

  const visibleCasesIds = allIds.slice(
    scrollPosition,
    scrollPosition + cardsToShow
  );

  const canGoPrevious = scrollPosition > 0;
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
          {[Roles.paralegal, Roles.foundingManager].includes(user?.role!) && (
            <button
              onClick={() => caseFormModal.openCaseFormModal()}
              className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 
            py-3 text-sm font-medium text-white transition-all 
            hover:bg-[#C4A037] active:scale-95 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add New Case
            </button>
          )}
        </div>

        {/* Search Bar and Filters */}
        <div className="mb-6">
          <div
            className="flex flex-col sm:flex-row gap-3 sm:items-center
           sm:justify-between"
          >
            {/* Search Input - Left */}
            <div className="relative flex-1 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2
               text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by client name or case"
                value={search ?? ""}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setScrollPosition(0);
                }}
                className="w-full rounded-lg border-2 border-gray-200 bg-white
                 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500
                  transition-all focus:border-[#D4AF37] focus:outline-none 
                  dark:border-gray-700 dark:bg-gray-800 dark:text-white
                   dark:placeholder-gray-400"
              />
            </div>

            {/* Sort and Reset - Right */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortFilter ?? "created_at"}
                onChange={(e) => hanldeSortBy(e.target.value)}
                className="rounded-lg border-2 border-gray-200 bg-white py-3
                px-4 text-sm text-gray-900 transition-all focus:border-[#D4AF37] 
                focus:outline-none dark:border-gray-700 dark:bg-gray-800
                 dark:text-white cursor-pointer hover:border-gray-300 
                 dark:hover:border-gray-600"
              >
                <option value="created_at">Sort by: Date Filed</option>
                <option value="consultation_date">
                  Sort by: Consultation Date
                </option>
              </select>

              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 rounded-lg border-2 
                border-gray-200 bg-white px-4 py-3 text-sm font-medium 
                text-gray-700 transition-all hover:border-[#D4AF37] 
                hover:bg-gray-50 active:scale-95 dark:border-gray-700 
                dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[#D4AF37]
                 dark:hover:bg-gray-700 whitespace-nowrap"
                title="Reset all filters"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div
          className="rounded-lg border-2 border-gray-200 bg-white px-6 py-8
         dark:border-gray-700 dark:bg-gray-800 xl:px-10 xl:py-12 relative"
        >
          {/* Loading Overlay */}
          {filterLoading && (
            <div
              className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 
              backdrop-blur-sm rounded-lg z-10 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Loading cases...
                </p>
              </div>
            </div>
          )}

          {/* Cards Container */}
          <div
            className={`mx-auto max-w-7xl ${
              filterLoading ? "opacity-50" : "opacity-100"
            } transition-opacity duration-200`}
          >
            {allIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                {onFiltered ? (
                  <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                ) : (
                  <MessageSquareOff className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                )}

                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No cases found
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {onFiltered
                    ? "Try adjusting your search terms"
                    : "No Consultation found"}
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
                          className="group relative flex flex-col 
                          rounded-lg border-2 border-gray-200 bg-white p-6
                           transition-all duration-300 hover:border-[#D4AF37] 
                           hover:shadow-lg dark:border-gray-700 dark:bg-gray-800
                            dark:hover:border-[#D4AF37] h-[380px]"
                          style={{
                            animation: `fadeIn 0.3s ease-out ${
                              index * 0.1
                            }s both`,
                          }}
                        >
                          {[Roles.paralegal, Roles.foundingManager].includes(
                            user?.role!
                          ) && (
                            <div
                              className="absolute top-3 right-3 flex gap-1 
                          opacity-0 group-hover:opacity-100 transition-opacity
                           duration-200"
                            >
                              <button
                                onClick={() =>
                                  caseFormModal.openCaseFormModal(caseData)
                                }
                                className="rounded-md bg-gray-100 dark:bg-inherit
                               p-1.5 text-gray-600 dark:text-gray-400 
                               transition-all hover:text-blue-500 
                               dark:hover:text-blue-400 active:scale-95"
                                title="Edit case"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteCaseModal.openDeleteCase({
                                    caseId: caseData.id!,
                                    concern: caseData.concern,
                                  })
                                }
                                className="rounded-md bg-gray-100 dark:bg-inherit
                               p-1.5 text-gray-600 dark:text-gray-400
                                transition-all hover:text-red-500 
                                dark:hover:text-red-400 active:scale-95"
                                title="Delete case"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Concern Title */}
                          <h3
                            className="mb-3 text-lg font-bold text-gray-900
                           dark:text-white pr-16"
                          >
                            {caseData.concern}
                          </h3>

                          {/* Gold Accent Line */}
                          <div className="h-px w-12 bg-[#D4AF37] mb-4"></div>

                          {/* Description - Truncated to 2 lines */}
                          <p
                            className="mb-5 text-sm leading-relaxed
                           text-gray-600 dark:text-gray-300 line-clamp-2"
                          >
                            {caseData.description}
                          </p>

                          {/* Spacer to push content to bottom */}
                          <div className="flex-1"></div>

                          {/* Client Info */}
                          <div
                            className="mb-5 rounded-lg bg-gray-50 p-4 
                          dark:bg-gray-900"
                          >
                            <p
                              className="text-xs font-medium text-gray-500
                             dark:text-gray-400 mb-1"
                            >
                              Client
                            </p>
                            <p
                              className="text-sm font-bold text-gray-900
                             dark:text-white"
                            >
                              {caseData.client_name}
                            </p>
                          </div>

                          {/* Date and Button */}
                          <div
                            className="flex items-center justify-between 
                          pt-4 border-t border-gray-200 dark:border-gray-700"
                          >
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
                              className="flex items-center gap-1.5 rounded-lg 
                              bg-[#D4AF37] px-4 py-2 text-xs font-medium 
                              text-white transition-all hover:bg-[#C4A037]
                               active:scale-95"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-10 flex flex-col items-center gap-6">
                  {/* Page Indicators - show SERVER pages */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const maxDots = 5;
                      const dots = [];

                      // If we have 5 or fewer pages loaded, show all
                      if (currentPage <= maxDots) {
                        for (let i = 1; i <= currentPage; i++) {
                          dots.push(
                            <div
                              key={i}
                              className={`h-2 rounded-full transition-all ${
                                visualPage === i
                                  ? "w-8 bg-[#D4AF37]"
                                  : "w-2 bg-gray-300 dark:bg-gray-600"
                              }`}
                              title={`Page ${i}`}
                            />
                          );
                        }
                      } else {
                        // Show first page
                        dots.push(
                          <div
                            key={1}
                            className={`h-2 rounded-full transition-all ${
                              visualPage === 1
                                ? "w-8 bg-[#D4AF37]"
                                : "w-2 bg-gray-300 dark:bg-gray-600"
                            }`}
                            title="Page 1"
                          />
                        );

                        // Show ellipsis if current page is far from start
                        if (visualPage > 3) {
                          dots.push(
                            <span
                              key="ellipsis-start"
                              className="text-gray-400 text-xs px-1"
                            >
                              ...
                            </span>
                          );
                        }

                        // Show current page ± 1
                        for (
                          let i = Math.max(2, visualPage - 1);
                          i <= Math.min(currentPage - 1, visualPage + 1);
                          i++
                        ) {
                          dots.push(
                            <div
                              key={i}
                              className={`h-2 rounded-full transition-all ${
                                visualPage === i
                                  ? "w-8 bg-[#D4AF37]"
                                  : "w-2 bg-gray-300 dark:bg-gray-600"
                              }`}
                              title={`Page ${i}`}
                            />
                          );
                        }

                        // Show ellipsis if current page is far from end
                        if (visualPage < currentPage - 2) {
                          dots.push(
                            <span
                              key="ellipsis-end"
                              className="text-gray-400 text-xs px-1"
                            >
                              ...
                            </span>
                          );
                        }

                        // Show last loaded page
                        dots.push(
                          <div
                            key={currentPage}
                            className={`h-2 rounded-full transition-all ${
                              visualPage === currentPage
                                ? "w-8 bg-[#D4AF37]"
                                : "w-2 bg-gray-300 dark:bg-gray-600"
                            }`}
                            title={`Page ${currentPage}`}
                          />
                        );
                      }

                      return dots;
                    })()}

                    {hasMore && (
                      <div
                        className="w-2 h-2 rounded-full bg-gray-200
                         dark:bg-gray-700 animate-pulse"
                        title="More data available"
                      />
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePrevious}
                      disabled={!canGoPrevious || filterLoading}
                      className="flex items-center gap-2 rounded-lg border-2 
                      border-gray-200 bg-white px-5 py-2.5 text-sm font-medium
                       text-gray-700 transition-all hover:border-[#D4AF37]
                        hover:bg-gray-50 disabled:cursor-not-allowed
                         disabled:opacity-50 disabled:hover:bg-white
                          disabled:hover:border-gray-200 dark:border-gray-700
                           dark:bg-gray-800 dark:text-gray-300 
                           dark:hover:border-[#D4AF37] dark:hover:bg-gray-700
                            dark:disabled:hover:bg-gray-800 
                            dark:disabled:hover:border-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Page {visualPage} of {totalPages}
                    </span>

                    <button
                      onClick={handleNext}
                      disabled={!canGoNext || filterLoading}
                      className="flex items-center gap-2 rounded-lg bg-[#D4AF37]
                       px-5 py-2.5 text-sm font-medium text-white transition-all
                        hover:bg-[#C4A037] disabled:cursor-not-allowed 
                        disabled:opacity-50 disabled:hover:bg-[#D4AF37]"
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
      <AddCaseModal
        loading={caseFormModal.fetchingClient}
        submitting={caseFormModal.addLoading}
        isOpen={caseFormModal.isCaseFormModal}
        onClose={caseFormModal.closeCaseFormModal}
        mode={caseFormModal.mode}
        onSubmitNewCase={caseFormModal.onNewCaseSubmit}
        onEditNewCase={caseFormModal.onEditCaseSubmit}
        onCaseChangeInput={caseFormModal.onCaseChangeInput}
        onClientChangeInput={caseFormModal.onClientChangeInput}
        caseInput={caseFormModal.caseInputValue}
        clientInput={caseFormModal.clientInputValue}
        setDateForm={caseFormModal.setDateForm}
        dateForm={caseFormModal.dateForm}
      />
      <ViewCaseModal
        isInputEnable={[Roles.foundingManager, Roles.paralegal].includes(
          user?.role!
        )}
        setPaymentType={viewCaseModalState.setPaymentType}
        paymentType={viewCaseModalState.paymentType}
        setPromiseToPayDate={viewCaseModalState.setPromiseToPayDate}
        promiseToPayDate={viewCaseModalState.promiseToPayDate}
        isOpen={viewCaseModalState.isViewConsultCaseModalOpen}
        onClose={viewCaseModalState.closeViewConsultCaseModal}
        caseData={viewCaseModalState.selectedCase!}
        onConfirm={viewCaseModalState.confirmCase}
      />
      <DeleteCaseModal
        isOpen={deleteCaseModal.isCaseDeleteOpen}
        onClose={deleteCaseModal.closeDeleteCase}
        onConfirm={deleteCaseModal.onConfirm}
        caseName={deleteCaseModal.caseDetials?.concern!}
        isDeleting={deleteCaseModal.isDeleting}
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
