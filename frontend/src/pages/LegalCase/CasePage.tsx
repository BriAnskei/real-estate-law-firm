import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import useCase from "../../hooks/case/ongoing/useCase";
import CasesTable from "../../components/tables/LegalCaseTable/CasesTable";
import { DeleteCaseModal } from "../../components/modal/caseModal/deleteCaseModal";

export default function CasesPage() {
  const {
    displayData,
    loading,
    search,
    setSearch,
    filter,
    setFilter,

    clearFilterInput,

    // delete state
    openDeleteCase,
    onConfirm,
    caseDetials,
    closeDeleteCase,
    isCaseDeleteOpen,
    isDeleting,
  } = useCase();

  return (
    <>
      <PageMeta
        title="Cases | Legal Case Management"
        description="View and manage all ongoing legal cases"
      />
      <PageBreadcrumb pageTitle="Cases" />
      <div className="space-y-6">
        <ComponentCard title="All Cases">
          <CasesTable
            byId={displayData.byId}
            allIds={displayData.allIds}
            search={search}
            setSearch={setSearch}
            loading={loading}
            clearFilter={clearFilterInput}
            statusFilter={filter}
            setStatusFilter={setFilter}
            deleteCase={openDeleteCase}
          />
        </ComponentCard>
      </div>
      <DeleteCaseModal
        isOpen={isCaseDeleteOpen}
        onClose={closeDeleteCase}
        onConfirm={onConfirm}
        isDeleting={isDeleting}
        caseName={caseDetials ? caseDetials.concern : undefined}
      />
    </>
  );
}
