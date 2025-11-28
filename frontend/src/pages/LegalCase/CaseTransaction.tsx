import React, { JSX, useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  User,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";

import StatusDropdown from "../../components/ui/dropdown/caseTransaction/StatusDropdown";
import { Route, Routes, useNavigate, useParams } from "react-router";

import {
  CaseStageStatus,
  CaseTransactionTask,
} from "../../store/Slice/case.slice";
import {
  CaseTransactionProvider,
  TabTypes,
  useCaseTransaction,
} from "../../context/CaseTransactionContext";
import CaseTransactionLoader from "../../components/ui/loading/CaseTransactionLoader";
import useCaseStage from "../../hooks/case/ongoing/useCaseTransaction";
import { useSelector } from "react-redux";
import {
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../store/selector/authSelector";
import ExampleViewTask from "./TaskViewPage";
import TaskReviewPage from "./TaskReviewPage";
import { RootState } from "../../store/store";
import TaskFormPage from "./TaskFormPage";
import { DeleteTaskModal } from "../../components/modal/caseModal/DeleteTaskModal";

export default function CaseTransaction() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { id } = useParams();

  // before rendeer wait for the refresh token
  if (!accessToken) return;

  return (
    <CaseTransactionProvider caseId={id}>
      <Routes>
        <Route path="" element={<Content />} />
        <Route
          path="form/:stageId/:stage/:taskId?"
          element={<TaskFormPage />}
        />
        <Route path="task/:taskId" element={<ExampleViewTask />} />
        <Route path="review/" element={<TaskReviewPage />} />
      </Routes>
    </CaseTransactionProvider>
  );
}

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="10"
          fill="none"
          className="dark:stroke-gray-700"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#D4AF37"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

function Header({
  formatDate,
  getCompletedStagesCount,
  concern,
  date_filed,
  calculateProgress,
}: {
  concern: string;
  date_filed: string;
  formatDate: (dateString: string) => string;
  getCompletedStagesCount: () => number;
  calculateProgress: () => number;
}) {
  return (
    <div className="mb-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
            hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back to Cases</span>
      </button>

      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {concern}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Case filed on {formatDate(date_filed)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <CircularProgress percentage={calculateProgress()} />
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {getCompletedStagesCount()} of 3 stages complete
          </p>
        </div>
      </div>
    </div>
  );
}

function Tabs({
  setActiveTab,
  activeTab,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<TabTypes>>;
  activeTab: string;
}) {
  return (
    <div className="mb-6 border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex gap-1 overflow-x-auto">
        {[
          { id: "details", label: "Case Details" },
          { id: "requirements", label: "Case Requirements" },
          { id: "documents", label: "Legal Documents" },
          { id: "hearings", label: "Hearing/Case Proper" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabTypes)}
            className={`px-6 py-3 text-sm font-medium transition-all whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Content() {
  const { loading, caseData, formatDate, setActiveTab, activeTab } =
    useCaseTransaction();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthLoading = useSelector(selectAuthLoading);

  // const calculateProgress = () => {
  //   let completedStages = 0;
  //   if (requirementsStatus === "complete") completedStages++;
  //   if (documentsStatus === "complete") completedStages++;
  //   if (hearingsStatus === "complete") completedStages++;
  //   return (completedStages / 3) * 100;
  // };

  // const getCompletedStagesCount = () => {
  //   let count = 0;
  //   if (requirementsStatus === "complete") count++;
  //   if (documentsStatus === "complete") count++;
  //   if (hearingsStatus === "complete") count++;
  //   return count;
  // };

  if (loading || !isAuthenticated || isAuthLoading || caseData === undefined)
    return (
      <CaseTransactionLoader
        isLoading={loading || !isAuthenticated || isAuthLoading}
      />
    );

  const Pages = (): JSX.Element => {
    switch (activeTab) {
      case "details":
        return <CaseDetailsTab />;
      default:
        return <CaseStage tabName={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Header
          formatDate={formatDate}
          date_filed={caseData?.created_at!}
          concern={caseData?.concern!}
          getCompletedStagesCount={() => 2}
          calculateProgress={() => 2}
        />

        <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />

        {/* Content */}
        <div className="rounded-lg border-2 border-gray-200 bg-white px-6 py-8 dark:border-gray-700 dark:bg-gray-800 xl:px-10 xl:py-12">
          <Pages />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// case details
function CaseDetailsTab() {
  const { formatDate, caseData, clientData } = useCaseTransaction();

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            CONCERN
          </h3>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {caseData!.concern}
          </p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            DESCRIPTION
          </h3>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {caseData!.description}
          </p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            DATE FILED
          </h3>
          <p className="text-base text-gray-900 dark:text-white">
            {formatDate(caseData?.created_at!)}
          </p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            OPPOS ING PARTY
          </h3>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            {caseData!.opposing_party}
          </p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
            CLIENT INFORMATION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Name
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {clientData!.client_name}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {clientData!.email}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Contact
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {clientData!.contact_number}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Address
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {clientData!.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CaseStage({ tabName }: { tabName: Exclude<TabTypes, "details"> }) {
  const navigate = useNavigate();
  const {
    fetchStageTask,
    taskLoading,
    statusHandler,
    displayData,
    formatDate,
  } = useCaseTransaction();

  // manage stage data by path
  const { stage, task } = useMemo(() => displayData[tabName], [tabName]);

  // handle header lable
  const {
    handleStatusOnChange,
    displayHeaderText,
    addtask,
    updateTask,
    viewTask,

    taskDeleteState,
  } = useCaseStage({
    stageData: stage,
    stageTask: task,
    fetchStageTask,
    statusHandler,
    taskLoading,
  });

  const { title, description } = displayHeaderText[tabName];

  return (
    <>
      <div>
        <StageHeader
          title={title}
          description={description}
          status={stage!.stage_status}
          onAddTask={addtask}
          onStatusChange={handleStatusOnChange}
        />

        <AllTasks
          deleteTask={taskDeleteState.openModal}
          onEditTask={updateTask}
          tasks={task!}
          formatDate={formatDate}
          loading={taskLoading}
          onViewTask={viewTask}
        />
      </div>

      <DeleteTaskModal
        isOpen={taskDeleteState.isOpen}
        onClose={taskDeleteState.closeModal}
        onConfirm={taskDeleteState.deleteTask}
        isDeleting={taskDeleteState.deleteLoading}
      />
    </>
  );
}

// stage header
function StageHeader({
  title,
  description,
  status,
  onStatusChange,
  onAddTask,
}: {
  title: string;
  description: string;
  status: CaseStageStatus;
  onStatusChange: (status: CaseStageStatus) => void;
  onAddTask: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <StatusDropdown
          status={status}
          onStatusChange={onStatusChange}
          isOpen={dropdownOpen}
          setIsOpen={setDropdownOpen}
        />
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 
            py-3 text-sm font-medium text-white transition-all 
            hover:bg-[#C4A037] active:scale-95 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>
    </div>
  );
}

// tasks
const AllTasks = React.memo(function AllTasks({
  tasks,
  formatDate,
  loading = true,
  onEditTask,
  onViewTask,

  deleteTask,
}: {
  tasks: CaseTransactionTask[] | undefined;
  formatDate: (dateString: string) => string;
  loading?: boolean;
  onEditTask: (taskId: string) => void;
  onViewTask: (taskId: string) => void;

  deleteTask: (taskId: string) => void;
}) {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  }, []);

  if (loading || tasks === undefined) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex h-full flex-col rounded-lg border-2 border-gray-200 
            bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            style={{
              animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Title skeleton */}
            <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

            {/* Divider skeleton */}
            <div className="mb-4 h-px w-12 animate-pulse bg-gray-200 dark:bg-gray-700"></div>

            {/* Description skeleton */}
            <div className="mb-5 flex-1 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Date skeleton */}
            <div className="mb-4 flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="group relative flex h-full flex-col rounded-lg border-2 
    border-gray-200 bg-white p-6 transition-all duration-300 
    hover:border-[#D4AF37] hover:shadow-lg dark:border-gray-700 
    dark:bg-gray-800 dark:hover:border-[#D4AF37] cursor-pointer"
          style={{
            animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
          }}
        >
          {/* Action buttons - available on hover */}
          <div
            className="absolute top-3 right-3 flex gap-1 
    opacity-0 group-hover:opacity-100 transition-opacity
    duration-200"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewTask(task.id!);
              }}
              className="rounded-md bg-gray-100 dark:bg-inherit
      p-1.5 text-gray-600 dark:text-gray-400 
      transition-all hover:text-[#D4AF37] 
      dark:hover:text-[#D4AF37] active:scale-95"
              title="View task"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditTask(task.id!);
              }}
              className="rounded-md bg-gray-100 dark:bg-inherit
      p-1.5 text-gray-600 dark:text-gray-400 
      transition-all hover:text-blue-500 
      dark:hover:text-blue-400 active:scale-95"
              title="Edit task"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add your delete handler here
                deleteTask(task.id!);
              }}
              className="rounded-md bg-gray-100 dark:bg-inherit
      p-1.5 text-gray-600 dark:text-gray-400
      transition-all hover:text-red-500 
      dark:hover:text-red-400 active:scale-95"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
            {task.title}
          </h3>
          <div className="h-px w-12 bg-[#D4AF37] mb-4"></div>
          <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {task.description}
          </p>
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(task.due_date)}</span>
          </div>

          {/* Assignment Information */}
          <div className="mb-4 flex items-start justify-start gap-3">
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  Assigned by:{" "}
                  <span className="font-medium">{task.assigner_name}</span>
                </span>
              </div>
              <div className="flex items-center justify-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <User className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span>
                  Assigned to:{" "}
                  <span className="font-medium">{task.assignee_name}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {getStatusIcon(task.status)}
              <span className="capitalize">{task.status}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">{task.comments_count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
