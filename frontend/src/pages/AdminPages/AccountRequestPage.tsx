import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RegistrationRequestsTable from "../../components/tables/adminTables/RegistrationRequestsTable";
import RejectionModal from "../../components/modal/adminModals/RejectionModal";
import { useAccountRequest } from "../../hooks/state/accountRequest/useAccountRequest";
import { useEffect } from "react";

export default function AccountRequest() {
  const {
    modal,
    rejectionConfirmation,
    loading,
    data,
    onSearchHandler,
    onFilter,
    search,
    clearFilter,
  } = useAccountRequest();

  useEffect(() => {
    console.log("loading update: ", loading);
  }, [loading]);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Registration Request" />
      <div className="space-y-6">
        <ComponentCard title="Account Requests">
          <RegistrationRequestsTable
            openRejectionModal={modal.openModal}
            registrationData={data}
            isLoading={loading}
            onSearchHandler={onSearchHandler}
            onFilter={onFilter}
            searchQuery={search}
            clearFilter={clearFilter}
          />
        </ComponentCard>
      </div>
      <RejectionModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        userName={modal.userName}
        onConfirm={rejectionConfirmation}
      />
    </>
  );
}
