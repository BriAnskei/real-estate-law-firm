import { Filter, X, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  setDateFilter: (filter: { startDate: string; endDate: string }) => void;
  onClear: () => void;
}

type PresetOption =
  | "last7days"
  | "last30days"
  | "last3months"
  | "last6months"
  | "lastyear"
  | "custom";

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  setDateFilter,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>("custom");
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasFilter = Boolean(startDate || endDate);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset temp values if not applied
        setTempStartDate(startDate);
        setTempEndDate(endDate);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, startDate, endDate]);

  // Calculate dates based on preset
  const calculatePresetDates = (
    preset: PresetOption
  ): { start: string; end: string } => {
    const today = new Date();
    const end = today.toISOString().split("T")[0];
    let start = "";

    switch (preset) {
      case "last7days":
        start = new Date(today.setDate(today.getDate() - 7))
          .toISOString()
          .split("T")[0];
        break;
      case "last30days":
        start = new Date(today.setDate(today.getDate() - 30))
          .toISOString()
          .split("T")[0];
        break;
      case "last3months":
        start = new Date(today.setMonth(today.getMonth() - 3))
          .toISOString()
          .split("T")[0];
        break;
      case "last6months":
        start = new Date(today.setMonth(today.getMonth() - 6))
          .toISOString()
          .split("T")[0];
        break;
      case "lastyear":
        start = new Date(today.setFullYear(today.getFullYear() - 1))
          .toISOString()
          .split("T")[0];
        break;
      default:
        return { start: "", end: "" };
    }

    return { start, end };
  };

  const handlePresetClick = (preset: PresetOption) => {
    setSelectedPreset(preset);

    if (preset === "custom") {
      setTempStartDate("");
      setTempEndDate("");
    } else {
      const { start, end } = calculatePresetDates(preset);
      setTempStartDate(start);
      setTempEndDate(end);
    }
  };

  const handleApply = () => {
    setDateFilter({
      startDate: tempStartDate,
      endDate: tempEndDate,
    });

    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    onClear();
    setTempStartDate("");
    setTempEndDate("");
    setSelectedPreset("custom");
  };

  const presetOptions = [
    { value: "last7days" as PresetOption, label: "Last 7 Days" },
    { value: "last30days" as PresetOption, label: "Last 30 Days" },
    { value: "last3months" as PresetOption, label: "Last 3 Months" },
    { value: "last6months" as PresetOption, label: "Last 6 Months" },
    { value: "lastyear" as PresetOption, label: "Last Year" },
    { value: "custom" as PresetOption, label: "Custom" },
  ];

  return (
    <div className="relative flex items-center gap-3" ref={dropdownRef}>
      {/* Filter Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        {hasFilter && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rounded-full border-2 border-white dark:border-gray-900"></span>
        )}
      </button>

      {/* Clear Filter Icon Button */}
      <button
        onClick={handleClear}
        disabled={!hasFilter}
        className="flex items-center justify-center w-10 h-10 rounded-lg  hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
      >
        <X className="h-5 w-5 text-red-600 dark:text-red-400" />
      </button>

      {/* Active Filter Text */}
      {hasFilter && (
        <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-[#D4AF37]">Active:</span>{" "}
          {startDate || "Start"} → {endDate || "End"}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-[380px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Preset Options */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              {presetOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePresetClick(option.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedPreset === option.value
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Inputs */}
          {selectedPreset === "custom" && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    From
                  </label>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    To
                  </label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Date Preview for Presets */}
          {selectedPreset !== "custom" && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-gray-600 dark:text-gray-400">
                  {tempStartDate}{" "}
                  <span className="text-gray-400 dark:text-gray-500">to</span>{" "}
                  {tempEndDate}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 flex items-center justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#C49D2D] rounded-lg transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
