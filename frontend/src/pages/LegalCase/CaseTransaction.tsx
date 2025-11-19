import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  AddTaskModal,
  TaskFormData,
} from "../../components/modal/caseModal/AddTaskModal";

const mockCaseData = {
  id: "1",
  concern: "Property Dispute Resolution",
  description:
    "Client is involved in a boundary dispute with neighboring property owner. Requires legal documentation and mediation.",
  date_filed: "2024-01-15",
  client: {
    name: "John Doe",
    email: "john.doe@example.com",
    contact: "+63 912 345 6789",
    address: "123 Main Street, Davao City, Philippines",
  },
};

const mockTasks = {
  requirements: [
    {
      id: "req-1",
      name: "Gather Property Documents",
      description:
        "Collect all property deeds, tax declarations, and survey plans",
      due_date: "2024-02-01",
      status: "approved",
      comments_count: 3,
    },
    {
      id: "req-2",
      name: "Client Affidavit",
      description: "Prepare and notarize client's sworn statement",
      due_date: "2024-02-05",
      status: "pending",
      comments_count: 1,
    },
    {
      id: "req-3",
      name: "Witness Statements",
      description: "Obtain statements from property boundary witnesses",
      due_date: "2024-02-10",
      status: "rejected",
      comments_count: 5,
    },
  ],
  documents: [
    {
      id: "doc-1",
      name: "Complaint Filing",
      description: "Draft and file formal complaint with the court",
      due_date: "2024-02-15",
      status: "approved",
      comments_count: 2,
    },
    {
      id: "doc-2",
      name: "Motion for Mediation",
      description: "Prepare motion requesting court-ordered mediation",
      due_date: "2024-02-20",
      status: "pending",
      comments_count: 0,
    },
  ],
  hearings: [
    {
      id: "hear-1",
      name: "Preliminary Hearing",
      description: "Initial court appearance for case assessment",
      due_date: "2024-03-01",
      status: "pending",
      comments_count: 4,
    },
    {
      id: "hear-2",
      name: "Mediation Session",
      description: "Court-ordered mediation with opposing party",
      due_date: "2024-03-15",
      status: "pending",
      comments_count: 1,
    },
  ],
};

type TabType = "details" | "requirements" | "documents" | "hearings";
type StageStatus = "ongoing" | "complete";

interface Task {
  id: string;
  name: string;
  description: string;
  due_date: string;
  status: "pending" | "rejected" | "approved";
  comments_count: number;
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

export default function CaseDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [requirementsStatus, setRequirementsStatus] =
    useState<StageStatus>("ongoing");
  const [documentsStatus, setDocumentsStatus] =
    useState<StageStatus>("ongoing");
  const [hearingsStatus, setHearingsStatus] = useState<StageStatus>("ongoing");

  const [requirementsDropdownOpen, setRequirementsDropdownOpen] =
    useState(false);
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const [hearingsDropdownOpen, setHearingsDropdownOpen] = useState(false);

  const calculateProgress = () => {
    let completedStages = 0;
    if (requirementsStatus === "complete") completedStages++;
    if (documentsStatus === "complete") completedStages++;
    if (hearingsStatus === "complete") completedStages++;
    return (completedStages / 3) * 100;
  };

  const getCompletedStagesCount = () => {
    let count = 0;
    if (requirementsStatus === "complete") count++;
    if (documentsStatus === "complete") count++;
    if (hearingsStatus === "complete") count++;
    return count;
  };

  const getStatusIcon = (status: string) => {
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
  };

  const getStatusColor = (status: string) => {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const StatusDropdown = ({
    status,
    onStatusChange,
    isOpen,
    setIsOpen,
  }: {
    status: StageStatus;
    onStatusChange: (status: StageStatus) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  }) => (
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

  const renderTaskCards = (tasks: Task[]) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="group relative flex h-full flex-col rounded-lg border-2 
          border-gray-200 bg-white p-6 transition-all duration-300 
          hover:border-[#D4AF37] hover:shadow-lg dark:border-gray-700 
          dark:bg-gray-800 dark:hover:border-[#D4AF37]"
          style={{
            animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
          }}
        >
          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
            {task.name}
          </h3>
          <div className="h-px w-12 bg-[#D4AF37] mb-4"></div>
          <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {task.description}
          </p>
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(task.due_date)}</span>
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

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
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
                  {mockCaseData.concern}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Case filed on {formatDate(mockCaseData.date_filed)}
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
                  onClick={() => setActiveTab(tab.id as TabType)}
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

          <div className="rounded-lg border-2 border-gray-200 bg-white px-6 py-8 dark:border-gray-700 dark:bg-gray-800 xl:px-10 xl:py-12">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    CONCERN
                  </h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {mockCaseData.concern}
                  </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    DESCRIPTION
                  </h3>
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {mockCaseData.description}
                  </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    DATE FILED
                  </h3>
                  <p className="text-base text-gray-900 dark:text-white">
                    {formatDate(mockCaseData.date_filed)}
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
                        {mockCaseData.client.name}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Email
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {mockCaseData.client.email}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Contact
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {mockCaseData.client.contact}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Address
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {mockCaseData.client.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Case Requirements
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track all required documents and prerequisites for this
                      case
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusDropdown
                      status={requirementsStatus}
                      onStatusChange={setRequirementsStatus}
                      isOpen={requirementsDropdownOpen}
                      setIsOpen={setRequirementsDropdownOpen}
                    />
                    <button
                      onClick={() => console.log("Add requirement task")}
                      className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 
                    py-3 text-sm font-medium text-white transition-all 
                    hover:bg-[#C4A037] active:scale-95 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>
                </div>
                {renderTaskCards(mockTasks.requirements)}
              </div>
            )}

            {activeTab === "documents" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Legal Documents
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage all legal documents related to this case
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusDropdown
                      status={documentsStatus}
                      onStatusChange={setDocumentsStatus}
                      isOpen={documentsDropdownOpen}
                      setIsOpen={setDocumentsDropdownOpen}
                    />
                    <button
                      onClick={() => console.log("Add document task")}
                      className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 
                    py-3 text-sm font-medium text-white transition-all 
                    hover:bg-[#C4A037] active:scale-95 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>
                </div>
                {renderTaskCards(mockTasks.documents)}
              </div>
            )}

            {activeTab === "hearings" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Hearing/Case Proper
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Schedule and track all hearings and court proceedings
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusDropdown
                      status={hearingsStatus}
                      onStatusChange={setHearingsStatus}
                      isOpen={hearingsDropdownOpen}
                      setIsOpen={setHearingsDropdownOpen}
                    />
                    <button
                      onClick={() => console.log("Add hearing task")}
                      className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 
                    py-3 text-sm font-medium text-white transition-all 
                    hover:bg-[#C4A037] active:scale-95 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>
                </div>
                {renderTaskCards(mockTasks.hearings)}
              </div>
            )}
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
      <AddTaskModal
        isOpen={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSubmit={function (taskData: TaskFormData): void {
          throw new Error("Function not implemented.");
        }}
        taskType={"requirements"}
      />
    </>
  );
}
