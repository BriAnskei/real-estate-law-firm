import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AllAccountsTable from "../../components/tables/adminTables/AllAccountsTable";
import ClientsTable from "../../components/tables/LegalCaseTable/ClientTable";

export default function ClientPage() {
  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Clients" />
      <div className="space-y-6">
        <ComponentCard title="All Clients">
          <ClientsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
