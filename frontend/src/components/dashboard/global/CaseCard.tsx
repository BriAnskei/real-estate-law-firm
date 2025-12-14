import { FC } from "react";
import { User, Calendar } from "lucide-react";

/* ----------------------------- Types ----------------------------- */

type CaseData = {
  caseName: string;
  clientName: string;
  assignedDate: string | Date;
  stage: string;
};

type CaseCardProps = {
  caseData: CaseData;
};

/* --------------------------- Component --------------------------- */

const CaseCard: FC<CaseCardProps> = ({ caseData }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
          {caseData.caseName}
        </h4>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {caseData.clientName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            Assigned:{" "}
            {new Date(caseData.assignedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
            {caseData.stage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
