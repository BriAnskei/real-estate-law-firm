import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FC, useCallback, useMemo } from "react";
import { StageDistibutionCount } from "../../../context/DashboardContext";

/* ----------------------------- Types ----------------------------- */

type CaseStagesDistributionProps = {
  loading: boolean;
  stageDistributioncount?: StageDistibutionCount;
};

/* ------------------------- Custom Tooltip ------------------------- */

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
  }[];
  total: number;
};

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          {name}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Cases: <span className="font-bold">{value}</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {((value / total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }

  return null;
};

const ChartSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 animate-pulse">
    <div className="mb-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
    </div>

    <div
      className="flex items-center justify-center"
      style={{ height: "300px" }}
    >
      <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>

    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CaseStagesDistribution: FC<CaseStagesDistributionProps> = ({
  loading,

  stageDistributioncount,
}) => {
  if (loading || !stageDistributioncount) return <ChartSkeleton />;

  const caseStageData = useMemo(() => {
    return [
      {
        name: "Case Requirements",
        value: Number(stageDistributioncount.MANAGE_REQUIREMENTS),
        color: "#D4AF37",
      },
      {
        name: "Legal Documents",
        value: Number(stageDistributioncount.FILING_DOCS),
        color: "#8B7355",
      },
      {
        name: "Hearing/Case Proper",
        value: Number(stageDistributioncount.HEARING),
        color: "#4A4A4A",
      },
    ];
  }, [stageDistributioncount]);

  const totalCases = caseStageData.reduce((acc, item) => acc + item.value, 0);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
            Case Stages Distribution
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current distribution of ongoing cases across different stages
          </p>
        </div>

        {/* Chart */}
        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={caseStageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                labelLine={false}
                label={({ percent }) => `${(percent! * 100).toFixed(0)}%`}
              >
                {caseStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip total={totalCases} />} />

              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            {caseStageData.map((stage, index) => (
              <div key={index} className="text-center">
                <div
                  className="mx-auto mb-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  {stage.name}
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {stage.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseStagesDistribution;
