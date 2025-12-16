import {
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  List,
  CalendarX2,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router";
import { HearingStatusType, HearingType } from "../../../types/HearingTypes";

export default function HearingScheduleCard({
  openHearingSelection,
  formatDate,

  children,
  selectedHearing,
}: {
  openHearingSelection?: () => void;
  formatDate: (dateString: string) => string;
  children?: React.ReactNode;
  selectedHearing?: HearingType;
}) {
  const navigate = useNavigate();

  const getStatusConfig = (status: HearingStatusType) => {
    switch (status) {
      case "completed":
        return {
          color:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Completed",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="h-4 w-4" />,
          label: "Cancelled",
        };

      case "scheduled":
        return {
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Clock className="h-4 w-4" />,
          label: "Scheduled",
        };
      default:
        throw new Error("Invalid Hearing status");
    }
  };

  // If no hearing is selected, show empty state
  if (!selectedHearing) {
    return (
      <div className="mb-6">
        {/* Empty state when no hearing is selected */}
        <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4">
              <CalendarX2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Hearing Selected
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              Please select a hearing schedule to view and manage tasks for this
              case stage.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("hearing")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                  bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View All Hearings
              </button>
              <button
                onClick={openHearingSelection}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white 
                  bg-[#D4AF37] rounded-md hover:bg-[#C4A037] transition-colors"
              >
                <List className="h-4 w-4" />
                Select Hearing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(selectedHearing!.status!);

  return (
    <div className="mb-6">
      {children}

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mt-6">
        <div className="flex items-center justify-between gap-6 px-0 py-5">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selectedHearing.type}
              </h3>
            </div>

            {/* Vertical divider */}
            <div className="h-8 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

            {/* Date */}
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Calendar className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(selectedHearing.scheduled_date)}
              </span>
            </div>

            {/* Vertical divider */}
            <div className="h-8 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

            {/* Status */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.color}`}
            >
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </div>
          </div>

          {/* Right side: Action buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("hearing")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
                hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
            >
              <Eye className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">
                View Hearings
              </span>
            </button>
            <button
              onClick={openHearingSelection}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
                hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
            >
              <List className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">
                Select Hearing
              </span>
            </button>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>
      </div>
    </div>
  );
}
