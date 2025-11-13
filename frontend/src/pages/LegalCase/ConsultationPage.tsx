import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Eye } from "lucide-react";
import { useCases } from "../../hooks/case/useConsultCases";
import AddCaseModal from "../../components/modal/caseModal/NewCaseModal";
import { ViewCaseModal } from "../../components/modal/caseModal/ViewCaseModal";

// Mock data - In real app, this would come from API
const generateMockCases = (page) => {
  const casesPerPage = 12;
  const startId = (page - 1) * casesPerPage + 1;

  const concerns = [
    "Employment Contract Dispute",
    "Property Boundary Issue",
    "Intellectual Property Claim",
    "Business Partnership Dissolution",
    "Tax Assessment Appeal",
    "Insurance Claim Denial",
    "Landlord-Tenant Disagreement",
    "Debt Collection Matter",
    "Family Estate Distribution",
    "Consumer Rights Violation",
    "Employment Termination Case",
    "Contract Breach Allegation",
  ];

  const descriptions = [
    "Client requires legal consultation regarding contractual obligations and potential breach of terms.",
    "Seeking advice on property rights and boundary disputes with neighboring landowner.",
    "Consultation needed for protecting intellectual property and trademark infringement issues.",
    "Partnership dissolution requires mediation and fair asset distribution guidance.",
    "Client contests recent tax assessment and requires representation for appeal process.",
    "Insurance company denied legitimate claim, client seeks consultation for next steps.",
    "Dispute over lease terms and property maintenance responsibilities needs resolution.",
    "Creditor pursuing aggressive collection tactics, client needs debt management advice.",
    "Family members in disagreement over estate distribution and will interpretation.",
    "Product defect caused damages, consumer seeks advice on compensation claims.",
    "Wrongful termination case requiring review of employment contract and labor laws.",
    "Vendor failed to deliver services as agreed, breach of contract consultation needed.",
  ];

  const clients = [
    "John Martinez",
    "Sarah Thompson",
    "Michael Chen",
    "Emily Rodriguez",
    "David Kim",
    "Jessica Brown",
    "Robert Johnson",
    "Amanda Wilson",
    "Christopher Lee",
    "Maria Garcia",
    "James Anderson",
    "Lisa Taylor",
  ];

  return Array.from({ length: casesPerPage }, (_, i) => ({
    id: startId + i,
    concern: concerns[i % concerns.length],
    description: descriptions[i % descriptions.length],
    clientName: clients[i % clients.length],
    date: new Date(
      2025,
      10,
      Math.floor(Math.random() * 10) + 1
    ).toLocaleDateString(),
  }));
};

// Main Consultation Page Component
export default function ConsultationPage() {
  const { viewCaseModalState, addNewCaseModalState } = useCases();

  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);

  const totalPages = 5;
  const cardsToShow = 4;

  const cases = generateMockCases(currentPage);
  const visibleCases = cases.slice(
    scrollPosition,
    scrollPosition + cardsToShow
  );

  const handleNext = () => {
    if (scrollPosition + cardsToShow < cases.length) {
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

  const canGoPrevious = currentPage > 1 || scrollPosition > 0;
  const canGoNext =
    currentPage < totalPages || scrollPosition + cardsToShow < cases.length;

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

        {/* Main Content Container */}
        <div className="rounded-lg border-2 border-gray-200 bg-white px-6 py-8 dark:border-gray-700 dark:bg-gray-800 xl:px-10 xl:py-12">
          {/* Cards Container */}
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCases.map((caseItem, index) => (
                <div
                  key={caseItem.id}
                  className="group flex h-full flex-col rounded-lg border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#D4AF37]"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Concern Title */}
                  <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                    {caseItem.concern}
                  </h3>

                  {/* Gold Accent Line */}
                  <div className="h-px w-12 bg-[#D4AF37] mb-4"></div>

                  {/* Description */}
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {caseItem.description}
                  </p>

                  {/* Client Info */}
                  <div className="mb-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Client
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {caseItem.clientName}
                    </p>
                  </div>

                  {/* Date and Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {caseItem.date}
                    </span>
                    <button
                      onClick={() =>
                        viewCaseModalState.openViewConsultCaseModal(caseItem)
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-medium text-white transition-all hover:bg-[#C4A037] active:scale-95"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </div>
                </div>
              ))}
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
        isOpen={addNewCaseModalState.isAddNewCaseModal}
        onClose={addNewCaseModalState.closeAddNewCaseModal}
        onSubmit={addNewCaseModalState.onSubmit}
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
