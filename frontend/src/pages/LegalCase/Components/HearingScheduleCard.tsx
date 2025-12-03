import {
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Eye,
  ArrowRight,
  List,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function HearingScheduleCard({
  formatDate,
}: {
  formatDate: (dateString: string) => string;
}) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHearingListModalOpen, setIsHearingListModalOpen] = useState(false);
  const [currentHearing] = useState({
    title: "Initial Hearing",
    scheduled_date: "2024-03-15T10:00:00",
    status: "scheduled", // 'scheduled' | 'postponed' | 'completed'
    postponement_reason: null,
  });

  const getStatusConfig = (status: any) => {
    switch (status) {
      case "completed":
        return {
          color:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Completed",
        };
      case "postponed":
        return {
          color:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Postponed",
        };
      case "scheduled":
      default:
        return {
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Clock className="h-4 w-4" />,
          label: "Scheduled",
        };
    }
  };

  const statusConfig = getStatusConfig(currentHearing.status);

  return (
    <>
      <div className="mb-15 rounded-lg bg-white  dark:border-gray-700 dark:bg-gray-800">
        {/* Header with Title and Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          {/* Title Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
              HEARING TITLE
            </h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {currentHearing.title}
            </p>
          </div>

          {/* Action buttons - Top Right */}
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
              onClick={() => setIsHearingListModalOpen(true)}
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

        {/* Full-width gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent mb-4"></div>

        {/* Hearing Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                SCHEDULED DATE
              </h4>
              <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <span className="font-medium">
                  {formatDate(currentHearing.scheduled_date)}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                STATUS
              </h4>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig.color}`}
              >
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
              </div>
            </div>
          </div>

          {currentHearing.status === "postponed" &&
            currentHearing.postponement_reason && (
              <>
                <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    POSTPONEMENT REASON
                  </h4>
                  <p className="text-base text-gray-700 dark:text-gray-300">
                    {currentHearing.postponement_reason}
                  </p>
                </div>
              </>
            )}
        </div>
      </div>
    </>
  );
}
