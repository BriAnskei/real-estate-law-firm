import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RegistrationRequestsTable from "../../components/tables/adminTables/RegistrationRequestsTable";
import { useModal } from "../../hooks/useModal";
import RejectionModal from "../../components/modal/adminModals/RejectionModal";
import { useRejectionModal } from "../../hooks/state/modals/useRejectionModal";

export default function AccountRequest() {
  const { openModal, closeModal, isOpen, userName } = useRejectionModal();

  const onconfirm = () => {};

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Registration Request" />
      <div className="space-y-6">
        <ComponentCard title="Account Requests">
          <RegistrationRequestsTable openRejectionModal={openModal} />
        </ComponentCard>
      </div>
      <RejectionModal
        isOpen={isOpen}
        onClose={closeModal}
        userName={userName}
        onConfirm={onconfirm}
      />
    </>
  );
}
