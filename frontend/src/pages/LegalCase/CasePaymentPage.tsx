import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import usePayments from "../../hooks/case/payments/usePaymentDisplayData";
import PaymentsTable from "../../components/tables/LegalCaseTable/PaymentCaseTable";
import { MarkAsPaidModal } from "../../components/modal/caseModal/MarkAsPaidModal";
import useMarkPaidModal from "../../hooks/case/payments/useMarkPaidModal";

export default function PaymentsPage() {
  const {
    displayData,
    loading,

    query,
    setQuery,
    paidType,
    setPaidType,

    clearFilterInput,
  } = usePayments();

  const markPaidModalState = useMarkPaidModal();

  return (
    <>
      <PageMeta
        title="Payments | Legal Case Management"
        description="View and manage case payments"
      />
      <PageBreadcrumb pageTitle="Payments" />
      <div className="space-y-6">
        <ComponentCard title="Case Payments">
          <PaymentsTable
            byId={displayData.byId}
            allIds={displayData.allIds}
            search={query}
            setSearch={setQuery}
            loading={loading}
            clearFilter={clearFilterInput}
            paymentFilter={paidType}
            setPaymentFilter={setPaidType}
            markAsPaid={markPaidModalState.open}
          />
        </ComponentCard>
      </div>

      <MarkAsPaidModal
        isOpen={markPaidModalState.isOpen}
        onClose={markPaidModalState.close}
        caseDetails={markPaidModalState.caseDetails}
        onConfirm={markPaidModalState.onConfirm}
        isProcessing={markPaidModalState.confirmLoading}
      />
    </>
  );
}
