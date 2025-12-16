import { ChevronDown } from "lucide-react";
import { useRef, useEffect } from "react";
import {
  TaskFilterType,
  useCaseTransaction,
} from "../../../../context/CaseTransactionContext";
import { CaseStagesType } from "../../../../store/Slice/case.slice";

interface TaskFilterDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  stageData: CaseStagesType;
}

const TaskFilterDropdown: React.FC<TaskFilterDropdownProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const {
    taskFilterOption: filterOption,
    setTaskFilterOption: setFilterOption,
  } = useCaseTransaction();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const filterOptions: { value: TaskFilterType; label: string }[] = [
    { value: "all", label: "All Tasks" },
    { value: "assigned_to_me", label: "Assigned to Me" },
    { value: "assigned_by_me", label: "Assigned by Me" },
  ];

  const getFilterLabel = (filterValue: TaskFilterType): string => {
    const option = filterOptions.find((opt) => opt.value === filterValue);
    return option ? option.label : "All Tasks";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border-2 border-gray-300 
          bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all 
          hover:border-[#D4AF37] hover:bg-gray-50 dark:border-gray-600 
          dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[#D4AF37] 
          dark:hover:bg-gray-700"
      >
        <span>{getFilterLabel(filterOption)}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 rounded-lg border-2 
            border-gray-200 bg-white shadow-lg dark:border-gray-700 
            dark:bg-gray-800"
        >
          <div className="py-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilterOption(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                  ${
                    filterOption === option.value
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] font-medium"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilterDropdown;
