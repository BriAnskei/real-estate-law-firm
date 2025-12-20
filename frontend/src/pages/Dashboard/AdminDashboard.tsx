import { Scale, FileText, CheckCircle, Users, AlertCircle } from "lucide-react";
import MetricCard, {
  MetricCardSkeleton,
} from "../../components/dashboard/admin/MetricCard";

import UpcomingHearingsTable from "../../components/dashboard/admin/UpcommingHearings";
import PageMeta from "../../components/common/PageMeta";
import { useDashboard } from "../../context/DashboardContext";
import CaseStagesDistribution from "../../components/dashboard/admin/CaseStageDistribution";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { loading, adminDashboard } = useDashboard();

  const globalLoading = !adminDashboard || loading;

  return (
    <div>
      <PageMeta
        title="My Dashboard"
        description="Overview of cases, users, and tasks"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Summary of ongoing real estate cases and legal staff activity
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-6 mb-6">
        {globalLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <MetricCard
              onClick={() => navigate("/case")}
              icon={FileText}
              title="Total Cases"
              value={adminDashboard.cards.total_cases}
              iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            />
            <MetricCard
              onClick={() => navigate("/case")}
              icon={Scale}
              title="Active Cases"
              value={adminDashboard.cards.active_cases}
              iconBgColor="bg-green-100 dark:bg-green-900/20"
            />
            <MetricCard
              onClick={() => navigate("/case")}
              icon={CheckCircle}
              title="Completed Cases"
              value={adminDashboard.cards.completed_cases}
              iconBgColor="bg-purple-100 dark:bg-purple-900/20"
            />
            <MetricCard
              onClick={() => navigate("/accounts")}
              icon={Users}
              title="Total Users"
              value={adminDashboard.cards.total_users}
              iconBgColor="bg-amber-100 dark:bg-amber-900/20"
            />
            <MetricCard
              onClick={() => navigate("/case")}
              icon={AlertCircle}
              title="Past Due Tasks"
              value={adminDashboard.cards.due_tasks}
              iconBgColor="bg-red-100 dark:bg-red-900/20"
            />
          </>
        )}
      </div>

      {/* Case Stages Distribution and Upcoming Hearings - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Stages Distribution Chart */}
        <CaseStagesDistribution
          loading={globalLoading}
          stageDistributioncount={adminDashboard?.stageDistributionCount}
        />

        {/* Upcoming Hearings Table */}
        <UpcomingHearingsTable
          loading={globalLoading}
          upcomingHearings={adminDashboard?.upcommingHearings}
        />
      </div>
    </div>
  );
}
