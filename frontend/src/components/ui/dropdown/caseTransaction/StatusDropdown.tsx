import { ChevronDown } from "lucide-react";
import { CaseStageStatus } from "../../../../store/Slice/case.slice";

export default function StatusDropdown({
  status,
  onStatusChange,
  isOpen,
  setIsOpen,
}: {
  status: CaseStageStatus;
  onStatusChange: (status: CaseStageStatus) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border-2 border-gray-300 
          bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all 
          hover:border-[#D4AF37] hover:bg-gray-50 dark:border-gray-600 
          dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[#D4AF37] 
          dark:hover:bg-gray-700"
      >
        <span className="capitalize">{status}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 top-full z-20 mt-2 w-40 rounded-lg 
            border-2 border-gray-200 bg-white shadow-lg dark:border-gray-700 
            dark:bg-gray-800"
          >
            <button
              onClick={() => {
                onStatusChange("ongoing");
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-medium 
                text-gray-700 hover:bg-gray-50 dark:text-gray-300 
                dark:hover:bg-gray-700 first:rounded-t-lg"
            >
              Ongoing
            </button>
            <button
              onClick={() => {
                onStatusChange("complete");
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-medium 
                text-gray-700 hover:bg-gray-50 dark:text-gray-300 
                dark:hover:bg-gray-700 last:rounded-b-lg"
            >
              Complete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
