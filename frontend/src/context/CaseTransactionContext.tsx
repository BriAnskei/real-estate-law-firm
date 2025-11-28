import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CaseStageStatus,
  CaseStagesType,
  CaseTransactionTask,
  CaseType,
  Stages,
} from "../store/Slice/case.slice";
import { caseApi } from "../util/api/case.api";
import { CaseStagesApi } from "../util/api/case_stages.api";
import { TaskApi } from "../util/api/task.api";
import { ClientType } from "../store/Slice/client.slice";
import { ClientApi } from "../util/api/client.api";
import { TaskFormType } from "../hooks/case/ongoing/useTaskForm";

export type CaseTransactionContextType = {
  loading: boolean;
  taskLoading: boolean;
  caseData: CaseType | undefined;
  clientData: ClientType | undefined;

  displayData: Record<
    Exclude<TabTypes, "details">,
    {
      stage: CaseStagesType;
      task: CaseTransactionTask[] | undefined;
    }
  >;

  // functions
  fetchStageTask: (payload: {
    stageId: string;
    stageName: Stages;
  }) => Promise<void>;

  statusHandler: (
    stageId: string,
    stageName: Stages
  ) => (status: CaseStageStatus) => void;

  formatDate: (dateString: string) => string;

  // tab hook
  setActiveTab: React.Dispatch<React.SetStateAction<TabTypes>>;
  activeTab: TabTypes;
  addTask: (payload: { stage: Stages; newTask: CaseTransactionTask }) => void;

  updateTask: (payload: {
    taskId: string;
    input: TaskFormType;
    stage: Stages;
  }) => void;

  deleteTask: (payload: { taskId: string; stage: Stages }) => void;
};

export type TabTypes = "details" | "requirements" | "documents" | "hearings";

const CaseTransactionContext = createContext<CaseTransactionContextType | null>(
  null
);

export const CaseTransactionProvider: React.FC<{
  children: React.ReactNode;
  caseId?: string;
}> = ({ children, caseId }) => {
  const [activeTab, setActiveTab] = useState<TabTypes>("details");

  // case detials
  const [caseData, setCaseData] = useState<CaseType | undefined>(undefined);
  const [clientData, setClientData] = useState<ClientType | undefined>(
    undefined
  );
  // stages
  const [requirementsStage, setRequirementsStage] = useState<
    CaseStagesType | undefined
  >(undefined);
  const [documentsStage, setdocumentsStage] = useState<
    CaseStagesType | undefined
  >(undefined);
  const [hearingStage, setHearingStage] = useState<CaseStagesType | undefined>(
    undefined
  );

  // stages task
  const [requirementsTask, setRequirementsTask] = useState<
    CaseTransactionTask[] | undefined
  >(undefined);
  const [documentsTask, setDocumentsTask] = useState<
    CaseTransactionTask[] | undefined
  >(undefined);
  const [hearingTask, setHearingTask] = useState<
    CaseTransactionTask[] | undefined
  >(undefined);

  // global loader flag
  const [loading, setLoading] = useState(false);
  // task loader
  const [taskLoading, setTaskloading] = useState(false);

  useEffect(() => {
    async function initializeData() {
      if (!caseId) return;

      try {
        setLoading(true);

        // fetch case data
        const caseData = await caseApi.find(caseId);
        const clientData = await ClientApi.findById(caseData.client_id!);
        setClientData(clientData.data);
        setCaseData(caseData);

        // transaction stages
        const stages = await CaseStagesApi.getStages(caseId);

        setRequirementsStage(stages.requirementsStage);
        setdocumentsStage(stages.documentsStage);
        setHearingStage(stages.hearingStage);
      } catch (error) {
        console.error(error);
      } finally {
        // ResponseTimeout
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    }

    initializeData();
  }, [caseId]);

  // task functions
  const addTask = useCallback(
    (payload: { stage: Stages; newTask: CaseTransactionTask }) => {
      const { stage, newTask } = payload;

      switch (stage) {
        case "MANAGE_REQUIREMENTS":
          setRequirementsTask((prev) => [newTask, ...(prev || [])]);
          break;
        case "FILING_DOCS":
          setDocumentsTask((prev) => [newTask, ...(prev || [])]);
          break;
        case "HEARING":
          setHearingTask((prev) => [newTask, ...(prev || [])]);
          break;
        default:
          throw new Error("Invalid stage selection");
      }
    },
    [setRequirementsTask, setDocumentsTask, setHearingTask]
  );

  const fetchStageTask = useCallback(
    async (payload: { stageId: string; stageName: Stages }) => {
      if (taskLoading) return;
      setTaskloading(true);
      try {
        const { stageName } = payload;

        const response = (await TaskApi.getTask(payload)) ?? [];

        switch (stageName) {
          case "MANAGE_REQUIREMENTS":
            setRequirementsTask(response);
            break;
          case "FILING_DOCS":
            setDocumentsTask(response);
            break;
          case "HEARING":
            setHearingTask(response);
            break;
          default:
            throw new Error("Invalid stage name");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setTaskloading(false);
      }
    },
    []
  );

  const updateTask = useCallback(
    (payload: { taskId: string; input: TaskFormType; stage: Stages }) => {
      const { taskId, input, stage } = payload;

      const setterMap = {
        MANAGE_REQUIREMENTS: setRequirementsTask,
        FILING_DOCS: setDocumentsTask,
        HEARING: setHearingTask,
      } as const;

      const setter = setterMap[stage];
      if (!setter) return;

      setter((prev) =>
        prev?.map((task) =>
          task.id?.toString() === taskId.toString()
            ? { ...task, ...input }
            : task
        )
      );
    },
    [setRequirementsTask, setDocumentsTask, setHearingTask]
  );

  const deleteTask = useCallback(
    (payload: { taskId: string; stage: Stages }) => {
      const { taskId, stage } = payload;
      const setterMap = {
        MANAGE_REQUIREMENTS: setRequirementsTask,
        FILING_DOCS: setDocumentsTask,
        HEARING: setHearingTask,
      } as const;

      const setter = setterMap[stage];
      if (!setter) return;

      setter((prev) =>
        prev?.filter((t) => t.id?.toString() !== taskId.toString())
      );
    },
    [setRequirementsTask, setDocumentsTask, setHearingTask]
  );

  // stages functionss
  const updateStageStatus = useCallback(
    (payload: {
      stageId: string;
      stageName: Stages;
      status: CaseStageStatus;
    }) => {
      const { stageId, stageName, status } = payload;

      switch (stageName) {
        case "MANAGE_REQUIREMENTS":
          setRequirementsStage((prev) => ({ ...prev!, stage_status: status }));
          break;
        case "FILING_DOCS":
          setdocumentsStage((prev) => ({ ...prev!, stage_status: status }));
          break;
        case "HEARING":
          setHearingStage((prev) => ({ ...prev!, stage_status: status }));
          break;

        default:
          throw new Error("Invalid stage name");
      }
    },
    []
  );

  const statusHandler = useCallback((stageId: string, stageName: Stages) => {
    return (status: CaseStageStatus) => {
      updateStageStatus({ stageId, stageName, status });
    };
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const displayData = useMemo(
    () => ({
      documents: { stage: documentsStage!, task: documentsTask },
      requirements: { stage: requirementsStage!, task: requirementsTask },
      hearings: { stage: hearingStage!, task: hearingTask },
    }),
    [
      documentsStage,
      documentsTask,
      requirementsStage,
      requirementsTask,
      hearingStage,
      hearingTask,
    ]
  );

  return (
    <CaseTransactionContext.Provider
      value={
        {
          loading,
          taskLoading,
          displayData,

          fetchStageTask,

          statusHandler,

          caseData,
          clientData,
          formatDate,

          activeTab,
          setActiveTab,
          addTask,
          updateTask,
          deleteTask,
        } satisfies CaseTransactionContextType
      }
    >
      {children}
    </CaseTransactionContext.Provider>
  );
};

export const useCaseTransaction = () => {
  const context = useContext(CaseTransactionContext);
  if (!context)
    throw new Error(
      "CaseTransactionContext must ve used within a CaseTransactionProvider"
    );

  return context;
};
