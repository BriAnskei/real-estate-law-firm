import { FC } from "react";
import { Calendar, Clock } from "lucide-react";
import { UpcommingHearings } from "../../../context/DashboardContext";
import { segregateDateTime } from "../../../util/DateDecoder";

/* ----------------------------- Types ----------------------------- */

type UpcomingHearingsTableProps = {
  loading: boolean;
  upcomingHearings?: UpcommingHearings[];

  height?: number | string;
};

/* --------------------------- Component ---------------------------- */

const TableSkeleton = () => (
  <div
    className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 flex flex-col animate-pulse"
    style={{ height: "580px" }}
  >
    <div className="mb-6 flex items-center justify-between flex-shrink-0">
      <div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>

    <div className="overflow-y-auto flex-1">
      <table className="w-full">
        <thead className="sticky top-0 bg-white dark:bg-white/[0.03] z-10">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </th>
            <th className="text-left py-3 px-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UpcomingHearingsTable: FC<UpcomingHearingsTableProps> = ({
  loading,
  upcomingHearings,

  height = 547,
}) => {
  if (loading || !upcomingHearings) {
    return <TableSkeleton />;
  }

  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      style={{ height }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-shrink-0 items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
            Upcoming Hearings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Scheduled hearings for the next 7 days
          </p>
        </div>

        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-medium">Next 7 Days</span>
        </div>
      </div>

      {/* Table */}
      {upcomingHearings.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white dark:bg-white/[0.03]">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Case Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date &amp; Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Type
                </th>
              </tr>
            </thead>

            <tbody>
              {upcomingHearings.map((hearing, index) => {
                const dateTime = segregateDateTime(hearing.scheduled_date);
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-800 dark:text-white">
                        {hearing.case_concern}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {dateTime.date}
                        </span>
                        <span className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          {dateTime.time}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-[#D4AF37]">
                        {hearing.hearing_type}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <Calendar className="mb-3 h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No upcoming hearings scheduled
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingHearingsTable;
