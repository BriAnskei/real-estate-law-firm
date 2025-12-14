import { ComponentType } from "react";

type MetricCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: number;
  iconBgColor: string;
  isLoading?: boolean;
};

export const MetricCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
  </div>
);

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  title,
  value,
  iconBgColor,
  isLoading = false,
}) => {
  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`flex items-center justify-center w-12 h-12 ${iconBgColor} rounded-xl flex-shrink-0`}
        >
          <Icon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <h4 className="text-4xl font-bold text-gray-800 dark:text-white/90">
          {value.toLocaleString()}
        </h4>
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
    </div>
  );
};

export default MetricCard;
