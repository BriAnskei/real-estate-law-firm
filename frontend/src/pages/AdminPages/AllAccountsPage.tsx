import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import AllAccountsTable from "../../components/tables/adminTables/AllAccountsTable";

import PageMeta from "../../components/common/PageMeta";

export default function AllAccountPage() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Accounts" />
      <div className="space-y-6">
        <ComponentCard title="All Accounts">
          <AllAccountsTable />
        </ComponentCard>
      </div>
    </>
  );
}
