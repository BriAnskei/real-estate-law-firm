import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import OngoingCasesTable from "../../components/tables/LegalCaseTable/CasesTable";
import useCase from "../../hooks/case/ongoing/useCase";

export default function CasesPage() {
  const {
    displayData,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    openCaseTransaction,
    clearFilter,
    deleteCase,
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
          <OngoingCasesTable
            byId={displayData.byId}
            allIds={displayData.allIds}
            search={search}
            setSearch={setSearch}
            loading={loading}
            openCaseProgress={openCaseTransaction}
            clearFilter={clearFilter}
            statusFilter={filter}
            setStatusFilter={setFilter}
            deleteCase={deleteCase}
          />
        </ComponentCard>
      </div>
    </>
  );
}
