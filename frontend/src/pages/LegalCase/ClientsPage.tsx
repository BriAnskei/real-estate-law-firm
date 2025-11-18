import { useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { DeleteClientModal } from "../../components/modal/caseModal/deleteClientModal";
import AllAccountsTable from "../../components/tables/adminTables/AllAccountsTable";
import ClientsTable from "../../components/tables/LegalCaseTable/ClientTable";
import { useClient } from "../../hooks/case/client/useClients";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/selector/user/userSelector";
import { Roles } from "../../store/Slice/userSlice";

export default function ClientPage() {
  const user = useSelector(selectCurrentUser);
  const { setSearch, search, loading, displayData, deleteModal, clearFilter } =
    useClient();

  return (
    <>
      <div>
        <PageMeta
          title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
          description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />
        <PageBreadcrumb pageTitle="Clients" />
        <div className="space-y-6">
          <ComponentCard title="All Clients">
            <ClientsTable
              byId={displayData.byId}
              allIds={displayData.allIds}
              search={search}
              setSearch={setSearch}
              loading={loading}
              openDeleteModal={deleteModal.openDeleteModal}
              clearFilter={clearFilter}
              isActionEnable={[Roles.foundingManager, Roles.paralegal].includes(
                user?.role!
              )}
            />
          </ComponentCard>
        </div>
      </div>

      <DeleteClientModal
        isOpen={deleteModal.isOpen}
        clientName={deleteModal.data?.name}
        onClose={deleteModal.closeDeleteModal}
        onConfirm={deleteModal.confirm}
        isDeleting={deleteModal.isDeleting}
      />
    </>
  );
}
