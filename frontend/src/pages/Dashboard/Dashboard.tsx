import { FileText, LayoutList, Calendar } from "lucide-react";
import MetricCard from "../../components/dashboard/admin/MetricCard";
import UpcomingHearingsTable from "../../components/dashboard/admin/UpcommingHearings";
import MyTasksCard from "../../components/dashboard/global/MyTask";
import { useDashboard } from "../../context/DashboardContext";
import { useEffect } from "react";

export default function Dashboard() {
  const { globalDashboard, loading } = useDashboard();

  const isDashboardReady = loading || !globalDashboard;

  useEffect(() => {
    console.log("global dashboard: ", globalDashboard, isDashboardReady);
  }, [isDashboardReady, globalDashboard]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Overview of your cases, hearings, and tasks
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 mb-6">
        <MetricCard
          isLoading={isDashboardReady}
          icon={FileText}
          title="My Active Cases"
          value={globalDashboard?.activeCasesCount ?? 0}
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
        />
        <MetricCard
          isLoading={isDashboardReady}
          icon={LayoutList}
          title="Pending Tasks"
          value={globalDashboard?.pendingTaskCount ?? 0}
          iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
        />
        <MetricCard
          isLoading={isDashboardReady}
          icon={Calendar}
          title="Upcoming Hearings"
          value={globalDashboard?.upcommingHearingsCount ?? 0}
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
        />
      </div>

      {/* Bottom Row - Upcoming Hearings and My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingHearingsTable
          loading={isDashboardReady}
          upcomingHearings={globalDashboard?.upcommingHearings}
        />

        {/* My Tasks */}
        <MyTasksCard
          overDueTasks={globalDashboard?.overDueTasks}
          dueIn3Days={globalDashboard?.dueIn3Days}
          dueIn5Days={globalDashboard?.dueIn5Days}
          loading={loading}
        />
      </div>
    </div>
  );
}
